"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { Order, OrderStatus } from "@/lib/types";

const statusConfig: Record<
  OrderStatus,
  { label: string; description: string; color: string; icon: string }
> = {
  new: {
    label: "Поруџбина примљена",
    description: "Чекамо да кухиња преузме вашу поруџбину...",
    color: "#d97706",
    icon: "\u{1F4E9}",
  },
  preparing: {
    label: "Храна се припрема",
    description: "Кувари раде на вашој поруџбини!",
    color: "#ea580c",
    icon: "\u{1F525}",
  },
  done: {
    label: "Храна је готова!",
    description: "Можете преузети вашу поруџбину.",
    color: "#16a34a",
    icon: "\u2705",
  },
};

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const supabaseRef = useRef<ReturnType<typeof createBrowserSupabaseClient> | null>(null);
  if (typeof window !== "undefined" && !supabaseRef.current) {
    supabaseRef.current = createBrowserSupabaseClient();
  }

  useEffect(() => {
    if (!id) return;

    if (!supabaseRef.current) supabaseRef.current = createBrowserSupabaseClient();
    const supabase = supabaseRef.current;

    // Fetch order
    supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError(true);
        } else {
          setOrder(data as Order);
        }
        setLoading(false);
      });

    // Subscribe to updates on this order
    const channel = supabase
      .channel(`order-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ fontSize: 18, color: "#888" }}>Учитавање...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>&#128533;</div>
          <h1 style={{ fontSize: 22, marginTop: 12 }}>Поруџбина није пронађена</h1>
          <p style={{ color: "#888", marginTop: 8 }}>
            Проверите линк или контактирајте ресторан.
          </p>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const createdAt = new Date(order.created_at);
  const readyAt =
    order.estimated_minutes && order.status !== "done"
      ? new Date(createdAt.getTime() + order.estimated_minutes * 60000)
      : null;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px", minHeight: "100vh" }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Image
          src="/images/logo.png"
          alt="Месара Шишко"
          width={80}
          height={80}
          style={{ margin: "0 auto" }}
        />
      </div>

      {/* Status card */}
      <div
        style={{
          background: "#1a1315",
          borderRadius: 16,
          padding: 24,
          textAlign: "center",
          border: `2px solid ${status.color}`,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 8 }}>{status.icon}</div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: status.color,
            margin: "0 0 6px",
          }}
        >
          {status.label}
        </h1>
        <p style={{ color: "#b09890", fontSize: 15, margin: 0 }}>
          {status.description}
        </p>

        {/* Estimated time */}
        {order.estimated_minutes && order.status !== "done" && (
          <div
            style={{
              marginTop: 20,
              padding: "14px 16px",
              background: "#221720",
              borderRadius: 10,
            }}
          >
            <div style={{ fontSize: 14, color: "#888", marginBottom: 4 }}>
              Процењено време
            </div>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#f0e6e4" }}>
              ~{order.estimated_minutes} мин
            </div>
            {readyAt && (
              <div style={{ fontSize: 14, color: "#b09890", marginTop: 4 }}>
                Биће готово око{" "}
                {readyAt.toLocaleTimeString("sr-RS", {
                  timeZone: "Europe/Belgrade",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        )}

        {/* Waiting for estimate */}
        {!order.estimated_minutes && order.status === "new" && (
          <div
            style={{
              marginTop: 16,
              fontSize: 14,
              color: "#888",
              fontStyle: "italic",
            }}
          >
            Чекамо процену времена припреме...
          </div>
        )}

        {/* Done message */}
        {order.status === "done" && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "#0a2a0a",
              borderRadius: 10,
              color: "#16a34a",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Пријатно!
          </div>
        )}
      </div>

      {/* Order info */}
      <div
        style={{
          background: "#1a1315",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 14,
            color: "#888",
          }}
        >
          <span>
            Поруџбина од{" "}
            {createdAt.toLocaleTimeString("sr-RS", {
              timeZone: "Europe/Belgrade",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span style={{ fontWeight: "bold", color: "#A61C1C", fontSize: 18 }}>
            {order.total.toLocaleString("sr-RS")} дин
          </span>
        </div>
      </div>

      {/* Expandable items */}
      <button
        onClick={() => setShowItems(!showItems)}
        style={{
          width: "100%",
          background: "#1a1315",
          borderRadius: 12,
          padding: "14px 16px",
          border: "1px solid #2e2128",
          color: "#b09890",
          fontSize: 14,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Детаљи поруџбине ({order.items.length} ставки)</span>
        <span>{showItems ? "\u25B2" : "\u25BC"}</span>
      </button>

      {showItems && (
        <div
          style={{
            background: "#1a1315",
            borderRadius: "0 0 12px 12px",
            padding: 16,
            marginTop: -4,
            borderTop: "1px solid #2e2128",
          }}
        >
          {order.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: 14,
                borderBottom:
                  i < order.items.length - 1 ? "1px solid #2e2128" : "none",
              }}
            >
              <span style={{ color: "#f0e6e4" }}>
                {item.name}
                {item.size ? ` (${item.size})` : ""}{" "}
                <span style={{ color: "#888" }}>x{item.quantity}</span>
              </span>
              <span style={{ color: "#b09890", fontWeight: "bold" }}>
                {(item.price * item.quantity).toLocaleString("sr-RS")} дин
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
