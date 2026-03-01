# Backend Code Changelog - Mesara Sisko

Ovaj dokument opisuje sve backend fajlove, sta rade, i objasnjava svaku vaznu promenu u kodu.

---

## Pregled backend fajlova

| Fajl | Opis | Status |
|------|------|--------|
| `src/lib/supabase.ts` | Supabase klijent (konekcija na bazu) | Zavrsen |
| `src/lib/types.ts` | TypeScript tipovi (Order, CartItem...) | Zavrsen |
| `src/app/api/order/route.ts` | API ruta za slanje porudzbina | Zavrsen |
| `src/app/api/contact/route.ts` | API ruta za kontakt formu | Delimicno (TODO: email) |
| `src/app/kuhinja/page.tsx` | Kuhinjski dashboard (realtime) | Zavrsen |
| `src/app/porudzbina/[id]/page.tsx` | Pracenje porudzbine (realtime) | Zavrsen |
| `src/lib/cart-store.ts` | Zustand store za korpu | Zavrsen |
| `.env.example` | Primer env konfiguracije | Zavrsen |
| `docker-compose.yml` | Docker konfiguracija | Zavrsen |

---

## 1. `src/lib/supabase.ts` — Supabase klijent

**Svrha:** Kreira konekciju na Supabase bazu podataka. Postoje dva tipa klijenata.

### Kod i objasnjenje:

```typescript
// BROWSER klijent — koristi anon (javni) kljuc
// Koristi se u: /kuhinja, /porudzbina/[id]
// Svrha: realtime subscribtion (pracenje promena u bazi uzivo)
export function createBrowserSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // NEXT_PUBLIC_ prefiks znaci da je dostupno i u browser-u
  return createClient(url, anonKey);
}

// SERVER klijent — koristi service_role (tajni) kljuc
// Koristi se u: /api/order, /api/contact
// Svrha: upisivanje i azuriranje podataka u bazi (vece privilegije)
export function createServerSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // BEZ NEXT_PUBLIC_ prefiksa — dostupno SAMO na serveru
  return createClient(url, serviceRoleKey);
}
```

**Zasto dva klijenta?**
- `Browser klijent` (anon key): Ima ogranicene dozvole (samo citanje). Bezbedan za koristenje u browser-u jer je kljuc vidljiv korisnicima. Koristi se za realtime pracenje.
- `Server klijent` (service role key): Ima potpune dozvole (citanje, pisanje, brisanje). Koristi se SAMO u API rutama koje se izvrsavaju na serveru. Nikad ne izlazi iz servera.

---

## 2. `src/app/api/order/route.ts` — API ruta za porudzbine

**Svrha:** Prima porudzbinu od korisnika, cuva je u bazu, i salje email vlasniku.

**HTTP metoda:** `POST /api/order`

### Tok izvrsavanja:

```
1. Primi JSON telo zahteva
   ↓
2. Validacija (ime, telefon, stavke)
   ↓ (ako fali nesto → vrati 400 gresku)
3. Insert u Supabase orders tabelu
   ↓ (ako baza ne radi → vrati 500 gresku)
4. Posalji email (NON-BLOCKING)
   ↓ (ako email padne → samo loguj gresku, NE prekidaj)
5. Vrati { success: true, orderId: "uuid" }
```

### Ulazni podaci (request body):

```typescript
{
  name: string;          // Ime kupca (obavezno)
  phone: string;         // Telefon kupca (obavezno)
  note: string;          // Napomena (opciono)
  items: CartItem[];     // Stavke iz korpe (obavezno, min 1)
  total: number;         // Ukupna cena (obavezno)
  orderDetails: string;  // Detaljan opis za email (opciono)
}
```

### Kljucni delovi koda:

**Validacija (linija 11-16):**
```typescript
if (!name || !phone || !items || !Array.isArray(items) || items.length === 0) {
  return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
}
```
- Proverava da li postoje ime, telefon i stavke
- Proverava da je `items` niz i da nije prazan
- Vraca HTTP 400 (Bad Request) ako nesto fali

**Insert u bazu (linija 19-33):**
```typescript
const supabase = createServerSupabaseClient();
const { data: order, error: dbError } = await supabase
  .from("orders")
  .insert({
    customer_name: name,
    customer_phone: phone,
    note: note || "",
    items,                    // JSONB — cuva ceo niz objekata
    total,
    order_details: orderDetails || "",
    status: "new",            // Pocetni status
    estimated_minutes: null,  // Kuhinja postavlja kasnije
  })
  .select("id")              // Vrati samo ID nove porudzbine
  .single();                  // Ocekujemo tacno 1 rezultat
```
- Koristi SERVER klijent (service role kljuc)
- `items` se cuva kao JSONB — PostgreSQL cuva ceo JSON objekat
- Status je uvek `"new"` pri kreiranju
- `.select("id").single()` — trazi nazad samo UUID nove porudzbine

**Email (linija 44-107) — Non-blocking dizajn:**
```typescript
try {
  // ... pripremi i posalji email ...
  await resend.emails.send({ ... });
} catch (emailError) {
  // Email greska NE prekida porudzbinu!
  console.error("Email send error (order still saved):", emailError);
}
```
- Ceo email blok je u zasebnom `try/catch`
- Ako email padne, porudzbina je VEC SACUVANA u bazi
- Ovo je namerno — bolje da vlasnik dobije porudzbinu bez email-a nego da gost dobije gresku

**Email HTML sablon (linija 71-96):**
- Formatira HTML tabelu sa stavkama porudzbine
- Vreme se formatira u beogradsku vremensku zonu (`Europe/Belgrade`)
- Cene su formatirane u srpskom formatu (`sr-RS`)
- Boje su uskladene sa brendom (`#A61C1C` — crvena mesare)

---

## 3. `src/app/api/contact/route.ts` — API ruta za kontakt

**Svrha:** Prima upite sa kontakt forme.

**HTTP metoda:** `POST /api/contact`

**Trenutno stanje:** Loguje upit u konzolu. Email slanje jos NIJE implementirano (TODO u kodu).

### Kod:
```typescript
// Validacija
if (!name || !email || !message) {
  return NextResponse.json({ error: "All fields are required" }, { status: 400 });
}

// Trenutno samo loguje
console.log("=== NEW CONTACT INQUIRY ===");
console.log(`Name: ${name}`);
// ...

// TODO: Dodati Resend integraciju (isti pattern kao u order ruti)
```

**Sta fali:**
- Integracija sa Resend API-jem za slanje email-a vlasniku
- Opciono: cuvanje upita u Supabase tabeli za istoriju

---

## 4. `src/app/kuhinja/page.tsx` — Kuhinjski dashboard

**Svrha:** Realtime prikaz porudzbina za kuhinjsko osoblje. Prikazuje se na ekranu/tabletu u kuhinji.

### Kljucne funkcionalnosti:

**Realtime subscripcija (linija 131-154):**
```typescript
const channel = supabase
  .channel("orders-realtime")
  .on("postgres_changes",
    { event: "INSERT", schema: "public", table: "orders" },
    (payload) => {
      // Kad stigne NOVA porudzbina:
      setOrders((prev) => [newOrder, ...prev]);  // Dodaj na pocetak
      if (audioEnabled) playChime();              // Zvucni signal
      setFlashBorder(true);                       // Vizuelni signal (crveni blic)
    }
  )
  .on("postgres_changes",
    { event: "UPDATE", schema: "public", table: "orders" },
    (payload) => {
      // Kad se porudzbina AZURIRA (npr. status promeni):
      setOrders((prev) => prev.map(o => o.id === updated.id ? updated : o));
    }
  )
  .subscribe();
```
- Koristi Supabase Realtime (WebSocket konekcija)
- Slusa i INSERT (nova porudzbina) i UPDATE (promena statusa)
- Automatski azurira prikaz bez osvezavanja stranice

**Zvucno obavestavanja (linija 22-50):**
```typescript
function playChime() {
  const ctx = new AudioContext();
  // Dva tona: 800Hz pa 1000Hz — kratki zvucni signal
  // Koristi Web Audio API (radi u svim modernim pregledacima)
}
```
- Koristi Web Audio API (ne treba MP3 fajl)
- Korisnik mora da klikne "Покренеш приказ" prvo (browser zahteva interakciju pre zvuka)

**Ciklicna promena statusa (linija 171-184):**
```typescript
const cycleStatus = async (order) => {
  const next = { new: "preparing", preparing: "done", done: "done" };
  // Klik na dugme: new → preparing → done
  await supabase.from("orders").update({ status: newStatus }).eq("id", order.id);
};
```
- Jedno klik dugme za promenu statusa
- `new` (НОВО) → `preparing` (ПРИПРЕМА СЕ) → `done` (ГОТОВО)
- Azurira Supabase direktno, a realtime propagira promenu svuda

**Automatsko ciscenje (linija 105-115):**
```typescript
const AUTO_REMOVE_MS = 30 * 60 * 1000; // 30 minuta
// Svakog minuta proveri i ukloni porudzbine starije od 30 min sa ekrana
```

**Procena vremena (linija 187-192):**
```typescript
const PREP_PRESETS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 90];
// Kuvar bira procenjeno vreme pripreme klikom na dugme
// Gost vidi ovu procenu na /porudzbina/[id] stranici
```

---

## 5. `src/app/porudzbina/[id]/page.tsx` — Pracenje porudzbine

**Svrha:** Gost prati status svoje porudzbine u realnom vremenu.

### Kljucne funkcionalnosti:

**Ucitavanje porudzbine (linija 50-63):**
```typescript
supabase.from("orders").select("*").eq("id", id).single()
```
- Ucitava porudzbinu po UUID-u iz URL-a
- Ako ne postoji, prikazuje "Поруџбина није пронађена"

**Realtime pracenje (linija 66-84):**
```typescript
const channel = supabase
  .channel(`order-${id}`)
  .on("postgres_changes", {
    event: "UPDATE",
    table: "orders",
    filter: `id=eq.${id}`,  // Slusa SAMO ovu porudzbinu
  }, (payload) => {
    setOrder(payload.new as Order);  // Azuriraj ceo objekat
  })
  .subscribe();
```
- Slusa azuriranja SAMO za ovu jednu porudzbinu (efikasno)
- Kad kuhinja promeni status, gost odmah vidi promenu

**Prikaz statusa (linija 9-31):**
```typescript
const statusConfig = {
  new:       { label: "Поруџбина примљена", icon: "📩", color: "#d97706" },
  preparing: { label: "Храна се припрема",  icon: "🔥", color: "#ea580c" },
  done:      { label: "Храна је готова!",    icon: "✅", color: "#16a34a" },
};
```

**Procenjeno vreme (linija 111-114):**
```typescript
const readyAt = order.estimated_minutes
  ? new Date(createdAt.getTime() + estimated_minutes * 60000)
  : null;
// Izracunava kad ce biti gotovo: vreme kreiranja + procena kuvara
```

---

## 6. `.env.example` — Konfiguracija

```env
RESTAURANT_EMAIL=info@mesara-sisko.rs    # Gde salju email obavestavanja
RESEND_API_KEY=re_your_api_key_here      # Resend API kljuc
NEXT_PUBLIC_SUPABASE_URL=https://...     # Supabase URL (javno)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...     # Supabase anon kljuc (javno)
SUPABASE_SERVICE_ROLE_KEY=eyJ...         # Supabase tajni kljuc (SAMO server)
NEXT_PUBLIC_APP_URL=https://...          # URL aplikacije
```

**Pravilo imenovanja:**
- `NEXT_PUBLIC_` prefiks = dostupno i u browser-u i na serveru
- Bez prefiksa = dostupno SAMO na serveru (tajne vrednosti)

---

## 7. `docker-compose.yml` — Docker konfiguracija

```yaml
services:
  web:
    build: .              # Gradi iz Dockerfile-a u istom direktorijumu
    ports:
      - "4200:4200"       # Mapira port 4200 (kontejner) na 4200 (host)
    environment:
      - NODE_ENV=production
    restart: unless-stopped  # Automatski restartuje ako padne
```

---

## Supabase SQL — Struktura baze

### `orders` tabela:

| Kolona | Tip | Default | Opis |
|--------|-----|---------|------|
| `id` | UUID | `gen_random_uuid()` | Jedinstven ID porudzbine |
| `customer_name` | TEXT | — | Ime kupca |
| `customer_phone` | TEXT | — | Telefon kupca |
| `note` | TEXT | `''` | Napomena (opciono) |
| `items` | JSONB | — | Niz stavki iz korpe |
| `total` | NUMERIC | — | Ukupna cena u dinarima |
| `order_details` | TEXT | `''` | Tekstualni opis za email |
| `status` | TEXT | `'new'` | Status: new/preparing/done |
| `estimated_minutes` | INTEGER | `null` | Procena kuvara (u minutima) |
| `created_at` | TIMESTAMPTZ | `now()` | Vreme kreiranja |

### Politike pristupa (RLS):
- **Select**: Svi mogu citati (potrebno za kuhinju i pracenje)
- **Insert**: Svi mogu kreirati (potrebno za online porudzbine)
- **Update**: Svi mogu azurirati (potrebno za kuhinju da menja status)

---

## Evidencija promena

### Datum: 2026-02-28

| Fajl | Tip promene | Opis |
|------|------------|------|
| `dokumentacija/backend-setup-guide.md` | DODAT | Vodic za instalaciju i pokretanje backend-a |
| `dokumentacija/backend-code-changelog.md` | DODAT | Ovaj dokument — objasnjenje backend koda |

### Prethodne promene (iz git istorije):

| Datum | Fajl | Tip | Opis |
|-------|------|-----|------|
| Ranije | `src/app/api/order/route.ts` | DODAT | API ruta za porudzbine sa Supabase + Resend integracijom |
| Ranije | `src/app/api/contact/route.ts` | DODAT | API ruta za kontakt (samo logovanje, email TODO) |
| Ranije | `src/lib/supabase.ts` | DODAT | Dva Supabase klijenta (browser + server) |
| Ranije | `src/app/kuhinja/page.tsx` | DODAT | Kuhinjski dashboard sa realtime prikazom |
| Ranije | `src/app/porudzbina/[id]/page.tsx` | DODAT | Pracenje porudzbine za goste |
| Ranije | `docker-compose.yml` | DODAT | Docker konfiguracija za produkciju |
| Ranije | `.env.example` | DODAT | Primer konfiguracije sa svim potrebnim kljucevima |

> **Napomena:** Svaka buduca promena backend koda treba da se zabvelezi u sekciji "Evidencija promena" sa datumom, imenom fajla, tipom promene i opisom.
