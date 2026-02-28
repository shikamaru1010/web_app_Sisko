"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { Order, OrderStatus } from "@/lib/types";

const PREP_PRESETS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 90];
const AUTO_REMOVE_MS = 30 * 60 * 1000; // 30 minutes

const statusColors: Record<OrderStatus, string> = {
  new: "#dc2626",
  preparing: "#d97706",
  done: "#16a34a",
};

const statusLabels: Record<OrderStatus, string> = {
  new: "НОВО",
  preparing: "ПРИПРЕМА СЕ",
  done: "ГОТОВО",
};

function playChime() {
  try {
    const ctx = new AudioContext();
    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.frequency.value = 800;
    osc1.type = "sine";
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.4);
    // Second tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.frequency.value = 1000;
    osc2.type = "sine";
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.6);
    // Cleanup
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // Audio not available
  }
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("sr-RS", {
    timeZone: "Europe/Belgrade",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function minutesAgo(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
}

export default function KuhinjaPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clock, setClock] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [started, setStarted] = useState(false);
  const [flashBorder, setFlashBorder] = useState(false);
  const supabaseRef = useRef<ReturnType<typeof createBrowserSupabaseClient> | null>(null);
  if (typeof window !== "undefined" && !supabaseRef.current) {
    supabaseRef.current = createBrowserSupabaseClient();
  }

  // Clock
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("sr-RS", {
          timeZone: "Europe/Belgrade",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Audio preference
  useEffect(() => {
    const saved = localStorage.getItem("kuhinja-sound");
    if (saved === "off") setAudioEnabled(false);
  }, []);

  const toggleSound = () => {
    setAudioEnabled((prev) => {
      localStorage.setItem("kuhinja-sound", prev ? "off" : "on");
      return !prev;
    });
  };

  // Auto-cleanup old orders from display
  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => {
      setOrders((prev) =>
        prev.filter(
          (o) => Date.now() - new Date(o.created_at).getTime() < AUTO_REMOVE_MS
        )
      );
    }, 60000);
    return () => clearInterval(id);
  }, [started]);

  // Fetch initial orders + subscribe to realtime
  const initialize = useCallback(async () => {
    const supabase = supabaseRef.current!;
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const { data } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["new", "preparing"])
      .gte("created_at", twoHoursAgo)
      .order("created_at", { ascending: false });

    if (data) setOrders(data as Order[]);

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as Order;
          setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
          if (audioEnabled) playChime();
          setFlashBorder(true);
          setTimeout(() => setFlashBorder(false), 2000);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const updated = payload.new as Order;
          setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [audioEnabled]);

  useEffect(() => {
    if (!started) return;
    let cleanup: (() => void) | undefined;
    initialize().then((fn) => {
      cleanup = fn;
    });
    return () => cleanup?.();
  }, [started, initialize]);

  // Update order status
  const cycleStatus = async (order: Order) => {
    const next: Record<OrderStatus, OrderStatus> = {
      new: "preparing",
      preparing: "done",
      done: "done",
    };
    const newStatus = next[order.status];
    if (newStatus === order.status) return;

    await supabaseRef.current!
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);
  };

  // Set estimated minutes
  const setEstimate = async (orderId: string, minutes: number) => {
    await supabaseRef.current!
      .from("orders")
      .update({ estimated_minutes: minutes })
      .eq("id", orderId);
  };

  // "Click to start" overlay
  if (!started) {
    return (
      <div
        onClick={() => setStarted(true)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          cursor: "pointer",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 64 }}>&#128276;</div>
        <div style={{ fontSize: 28, fontWeight: "bold" }}>
          Кликни да покренеш приказ
        </div>
        <div style={{ fontSize: 16, color: "#888" }}>
          (потребно за звучна обавештења)
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter((o) => o.status !== "done");
  const doneOrders = orders.filter((o) => o.status === "done");

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        transition: "box-shadow 0.3s",
        boxShadow: flashBorder ? "inset 0 0 40px #dc2626" : "none",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          paddingBottom: 12,
          borderBottom: "1px solid #333",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: "bold", margin: 0 }}>
          Кухиња — Поруџбине
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button
            onClick={toggleSound}
            style={{
              background: "none",
              border: "1px solid #555",
              borderRadius: 8,
              padding: "6px 14px",
              color: audioEnabled ? "#16a34a" : "#888",
              cursor: "pointer",
              fontSize: 18,
            }}
            title={audioEnabled ? "Звук укључен" : "Звук искључен"}
          >
            {audioEnabled ? "\u{1F50A}" : "\u{1F507}"}
          </button>
          <div style={{ fontSize: 32, fontVariantNumeric: "tabular-nums", fontWeight: "bold" }}>
            {clock}
          </div>
        </div>
      </div>

      {/* Active orders */}
      {activeOrders.length === 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: 120,
            color: "#555",
            fontSize: 24,
          }}
        >
          Нема активних поруџбина
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: 16,
        }}
      >
        {activeOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onCycleStatus={() => cycleStatus(order)}
            onSetEstimate={(min) => setEstimate(order.id, min)}
          />
        ))}
      </div>

      {/* Done orders (faded) */}
      {doneOrders.length > 0 && (
        <>
          <h2
            style={{
              marginTop: 40,
              marginBottom: 12,
              color: "#555",
              fontSize: 18,
              borderTop: "1px solid #222",
              paddingTop: 16,
            }}
          >
            Завршене
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: 16,
              opacity: 0.4,
            }}
          >
            {doneOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCycleStatus={() => {}}
                onSetEstimate={() => {}}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onCycleStatus,
  onSetEstimate,
}: {
  order: Order;
  onCycleStatus: () => void;
  onSetEstimate: (min: number) => void;
}) {
  const borderColor = statusColors[order.status];
  const isNew = order.status === "new";

  return (
    <div
      style={{
        background: "#1a1a1a",
        borderRadius: 12,
        border: `3px solid ${borderColor}`,
        padding: 16,
        animation: isNew ? "pulse-border 1.5s ease-in-out infinite" : "none",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 ${borderColor}40; }
          50% { box-shadow: 0 0 20px 4px ${borderColor}60; }
        }
      `}</style>

      {/* Status + time header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <button
          onClick={onCycleStatus}
          style={{
            background: borderColor,
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "6px 16px",
            fontWeight: "bold",
            fontSize: 14,
            cursor: order.status !== "done" ? "pointer" : "default",
            letterSpacing: 1,
          }}
        >
          {statusLabels[order.status]}
        </button>
        <div style={{ color: "#888", fontSize: 14 }}>
          {formatTime(order.created_at)} ({minutesAgo(order.created_at)} мин)
        </div>
      </div>

      {/* Customer info */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 22, fontWeight: "bold" }}>
          {order.customer_name}
        </div>
        <div style={{ color: "#aaa", fontSize: 16 }}>
          {order.customer_phone}
        </div>
      </div>

      {/* Items */}
      <div
        style={{
          background: "#111",
          borderRadius: 8,
          padding: 12,
          marginBottom: 10,
        }}
      >
        {order.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 0",
              fontSize: 16,
              borderBottom: i < order.items.length - 1 ? "1px solid #222" : "none",
            }}
          >
            <span>
              {item.name}
              {item.size ? ` (${item.size})` : ""}{" "}
              <span style={{ color: "#888" }}>x{item.quantity}</span>
            </span>
            <span style={{ fontWeight: "bold" }}>
              {(item.price * item.quantity).toLocaleString("sr-RS")} дин
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        style={{
          textAlign: "right",
          fontSize: 20,
          fontWeight: "bold",
          color: "#dc2626",
          marginBottom: 8,
        }}
      >
        Укупно: {order.total.toLocaleString("sr-RS")} дин
      </div>

      {/* Note */}
      {order.note && (
        <div
          style={{
            background: "#2a2000",
            borderLeft: "3px solid #d97706",
            padding: "8px 12px",
            borderRadius: 4,
            marginBottom: 10,
            fontSize: 14,
            color: "#fbbf24",
          }}
        >
          {order.note}
        </div>
      )}

      {/* Prep time buttons */}
      {order.status !== "done" && (
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
            Процена времена (мин):
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {PREP_PRESETS.map((min) => (
              <button
                key={min}
                onClick={() => onSetEstimate(min)}
                style={{
                  background:
                    order.estimated_minutes === min ? "#d97706" : "#333",
                  color: order.estimated_minutes === min ? "#000" : "#ccc",
                  border: "none",
                  borderRadius: 4,
                  padding: "4px 10px",
                  fontSize: 14,
                  fontWeight: order.estimated_minutes === min ? "bold" : "normal",
                  cursor: "pointer",
                }}
              >
                {min}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
