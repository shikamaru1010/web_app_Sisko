# Backend Dokumentacija - Mesara Sisko

Kompletan pregled svih backend tehnologija, jezika, protokola i obrazaca koriscenih u aplikaciji.

> **Napomena:** Ovaj dokument objasnjava TEHNOLOGIJE i ZASTO su koriscene.
> Za instalaciju i pokretanje pogledaj → `backend-setup-guide.md`
> Za detaljan opis koda po fajlovima pogledaj → `backend-code-changelog.md`

---

## SADRZAJ

1. [Tehnoloski stek](#1-tehnoloski-stek)
2. [Node.js — runtime okruzenje](#2-nodejs--runtime-okruzenje)
3. [Next.js API Routes — serverski endpointi](#3-nextjs-api-routes--serverski-endpointi)
4. [HTTP / REST koncepti](#4-http--rest-koncepti)
5. [PostgreSQL — relaciona baza podataka](#5-postgresql--relaciona-baza-podataka)
6. [Supabase — Backend-as-a-Service](#6-supabase--backend-as-a-service)
7. [Supabase Realtime — WebSocket komunikacija](#7-supabase-realtime--websocket-komunikacija)
8. [Resend — Email servis](#8-resend--email-servis)
9. [Environment varijable — konfiguracija](#9-environment-varijable--konfiguracija)
10. [Docker — kontejnerizacija](#10-docker--kontejnerizacija)
11. [Sigurnosni obrasci](#11-sigurnosni-obrasci)
12. [Obrasci dizajna u backend-u](#12-obrasci-dizajna-u-backend-u)
13. [Kako frontend i backend komuniciraju](#13-kako-frontend-i-backend-komuniciraju)

---

## 1. Tehnoloski stek

| Tehnologija | Uloga | Alternativa | Zasto ova |
|-------------|-------|-------------|-----------|
| **Node.js** | Runtime za JavaScript na serveru | Python/Django, PHP/Laravel | Isti jezik (JS/TS) na frontu i beku, brz I/O |
| **Next.js API Routes** | HTTP endpointi | Express.js, Fastify | Vec koristi Next.js za frontend, nema potrebe za zasebnim serverom |
| **PostgreSQL** | Relaciona baza | MySQL, MongoDB | Podrska za JSONB, Realtime, besplatan na Supabase |
| **Supabase** | Hosted PostgreSQL + Realtime + Auth | Firebase, PlanetScale | Open-source, SQL (ne NoSQL), besplatan tier, odlican Realtime |
| **Resend** | Slanje email-ova | SendGrid, Mailgun, AWS SES | Najjednostavniji API, besplatan tier (100/dan), moderan developer UX |
| **Docker** | Kontejnerizacija za deploy | PM2, Vercel, bare VPS | Konzistentno okruzenje (isto radi lokalno i na serveru) |

---

## 2. Node.js — Runtime okruzenje

### Sta je Node.js?
Node.js je okruzenje koje omogucava pokretanje JavaScript-a van pregledaca — na serveru. Pregledac ima svoj JavaScript engine (V8 u Chrome-u), a Node.js koristi taj isti V8 engine ali ga pokrece kao samostalan program na serveru.

### Zasto je bitan za ovu aplikaciju?
- Next.js je IZGRAJEN na Node.js-u — bez njega nista ne radi
- API rute (`/api/order`, `/api/contact`) se izvrsavaju u Node.js okruzenju
- `npm` (Node Package Manager) instalira sve zavisnosti

### Kako radi u kontekstu aplikacije:
```
Korisnik otvori sajt
       ↓
Pregledac salje HTTP zahtev
       ↓
Node.js (server) prima zahtev
       ↓
Next.js rutira zahtev:
  - Ako je /sr/meni → renderuje React stranicu i vrati HTML
  - Ako je /api/order → izvrsi server-side kod i vrati JSON
       ↓
Odgovor se vraca pregledacu
```

### Event Loop (jednonitni model):
Node.js koristi **jednu nit** ali je **asinhroni** — ne ceka da se operacija zavrsi pre nego sto predje na sledecu:
```typescript
// Node.js NE CEKA da se insert zavrsi pre nego sto nastavi:
const insertPromise = supabase.from("orders").insert({...});
// Dok Supabase radi insert, Node moze opsluzyivati druge zahteve
const { data } = await insertPromise;  // Tek ovde ceka rezultat
```
Za restoransku aplikaciju sa 10-50 porudzbina na sat, ovo je vise nego dovoljno.

### Verzija u projektu: Node.js 22 (Alpine)
- Alpine = minimalisticki Linux (5MB umesto 100MB) — manji Docker image
- Node 22 = LTS (Long Term Support) — stabilna verzija sa dugom podrsikom

---

## 3. Next.js API Routes — Serverski endpointi

### Sta su API Routes?
Next.js API Routes su serverski endpointi koji se pisu unutar `src/app/api/` foldera. Oni NEMAJU UI — primaju HTTP zahtev i vracaju JSON odgovor. Zamenjuju potrebu za zasebnim backend serverom (Express.js, Fastify).

### Kako Next.js rutira API zahteve:
```
Fajl na disku:                       URL na koji odgovara:
src/app/api/order/route.ts     →     POST /api/order
src/app/api/contact/route.ts   →     POST /api/contact
```

Svaka `route.ts` datoteka eksportuje funkcije po HTTP metodi:
```typescript
// GET /api/nesto
export async function GET(request: NextRequest) { ... }

// POST /api/nesto
export async function POST(request: NextRequest) { ... }

// PUT, DELETE, PATCH — isto tako
```

### Request i Response objekti:

**NextRequest** — ulazni zahtev:
```typescript
export async function POST(request: NextRequest) {
  // Citanje JSON tela zahteva:
  const body = await request.json();
  // body = { name: "Marko", phone: "064...", items: [...] }

  // Citanje URL parametara (query string):
  const url = request.nextUrl;
  const id = url.searchParams.get("id");

  // Citanje header-a:
  const authHeader = request.headers.get("authorization");
}
```

**NextResponse** — odgovor servera:
```typescript
// Uspesan odgovor (HTTP 200):
return NextResponse.json({ success: true, orderId: "abc-123" });

// Greska — los zahtev (HTTP 400):
return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

// Greska — server problem (HTTP 500):
return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
```

### Razlika izmedju API ruta i stranica:

| Osobina | API Route (`route.ts`) | Page (`page.tsx`) |
|---------|----------------------|-------------------|
| Vraca | JSON podatke | HTML/React |
| Ima UI | Ne | Da |
| Izvrsava se | Uvek na serveru | Server ili klijent |
| Ko poziva | `fetch()` iz browser-a | Pregledac direktno |
| Primer | `/api/order` | `/sr/meni` |

### Zasto NE zasebni Express server?
- Next.js vec ima ugradjene API rute — nema potrebe za dva servera
- Manje konfiguracije, jedan deploy, jedan port (4200)
- Za malu restorany aplikaciju je API Routes sasvim dovoljno
- Kad bi aplikacija rasla, mogao bi se odvojiti backend u zasebni servis

---

## 4. HTTP / REST koncepti

### HTTP metode koriscene u projektu:

| Metoda | Znacenje | Koriscenje u projektu |
|--------|----------|-----------------------|
| `GET` | Citanje podataka | Stranice (meni, pocetna...) — Next.js automatski |
| `POST` | Kreiranje podataka | `/api/order` (nova porudzbina), `/api/contact` (novi upit) |

### HTTP status kodovi korisceni:

| Kod | Znacenje | Kad se koristi |
|-----|----------|----------------|
| `200` | OK — uspesno | Porudzbina sacuvana, kontakt primljen |
| `400` | Bad Request — los zahtev | Fali ime, telefon, ili prazna korpa |
| `500` | Internal Server Error — server greska | Supabase ne radi, neocekivani bag |

### JSON (JavaScript Object Notation):
Svi podaci izmedju frontend-a i backend-a putuju kao JSON:
```json
{
  "name": "Марко",
  "phone": "064 123 4567",
  "items": [
    { "id": "cevapi", "name": "Ћевапи", "price": 420, "quantity": 2 }
  ],
  "total": 840
}
```
- Tekstualni format citljiv i ljudima i masinama
- `Content-Type: application/json` header govori serveru da je telo zahteva JSON
- `request.json()` parsira JSON string u JavaScript objekat
- `NextResponse.json()` pretvara JavaScript objekat u JSON string

### Request/Response ciklus u projektu:
```
1. Korisnik klikne "Пошаљи поруџбину"
2. Browser salje:
   POST /api/order
   Content-Type: application/json
   Body: { name: "...", phone: "...", items: [...], total: 840 }

3. Server prima zahtev, obradjuje ga

4. Server vraca:
   HTTP 200
   Content-Type: application/json
   Body: { success: true, orderId: "a1b2c3d4-..." }

5. Browser cita odgovor i preusmerava na /porudzbina/a1b2c3d4-...
```

---

## 5. PostgreSQL — Relaciona baza podataka

### Sta je PostgreSQL?
PostgreSQL (ili Postgres) je najnaprednija open-source relaciona baza podataka. "Relaciona" znaci da se podaci cuvaju u tabelama sa kolonama i redovima (kao Excel tabela, ali sa pravilima).

### Zasto PostgreSQL a ne MongoDB/MySQL?
- **JSONB podrska** — moze da cuva JSON objekte u jednoj koloni (idealno za `items` polje porudzbine)
- **CHECK constraints** — baza SAMA odbija nevalidne podatke (status moze biti SAMO new/preparing/done)
- **Realtime** — Supabase koristi Postgres Publications za live azuriranja
- **Besplatno na Supabase** — 500MB storage, 2 projekta besplatno

### Tipovi podataka korisceni u orders tabeli:

| PostgreSQL tip | Sta je | Primer vrednosti | Zasto ovaj tip |
|---------------|--------|------------------|----------------|
| `UUID` | Univerzalni jedinstven identifikator | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` | Bezbedniji od auto-increment ID-a (nepredzidbiljiv) |
| `TEXT` | Tekst neogranicene duzine | `"Марко Марковић"` | Ime, telefon, napomena |
| `JSONB` | Binarni JSON (pretrazziv, indeksirbilni) | `[{"name":"Ћевапи","price":420}]` | Cuva celu korpu kao jedan objekat |
| `NUMERIC` | Precizan decimalni broj | `1550.00` | Cena — bez floating point gresaka |
| `INTEGER` | Ceo broj | `15` | Procenjeno vreme u minutima |
| `TIMESTAMPTZ` | Datum i vreme sa vremenskom zonom | `2026-02-28T16:30:00+01:00` | Vreme kreiranja porudzbine |

### UUID vs Auto-increment:
```
Auto-increment:  1, 2, 3, 4, 5...
  - Problem: Korisnik moze pogoditi ID druge porudzbine (/porudzbina/4)
  - Problem: Otkriva koliko imas porudzbina

UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
  - Nepredvidljiv — ne moze se pogoditi tudj
  - Generise se automatski sa gen_random_uuid()
```

### JSONB — cuvanje korpe u jednoj koloni:
```sql
-- Umesto 3 tabele (orders, order_items, items):
-- Koristi se JSONB koji cuva ceo niz objekata u jednoj koloni

items = [
  { "id": "cevapi", "name": "Ћевапи", "price": 420, "quantity": 2, "size": "200г" },
  { "id": "rosa", "name": "Роса вода", "price": 90, "quantity": 1 }
]
```
**Prednosti za ovu aplikaciju:**
- Jedna tabela umesto tri — jednostavnije upiti
- Nema JOIN-ova — brze citanje
- Cena i ime stavke su "zamrznuti" u trenutku porudzbine (ako se cena promeni u meniju, stare porudzbine ostaju tacne)

**Mane (ne uticu na malu aplikaciju):**
- Ne moze se lako filtrirati "sve porudzbine koje sadrze cevape" bez JSONB operatora
- Nema foreign key-a na stavke menija

### CHECK constraint:
```sql
status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'done'))
```
Baza SAMA odbija INSERT/UPDATE ako status nije jedan od tri dozvoljene vrednosti. Cak i ako bag u kodu posalje `status: "gotovo"`, baza ce odbiti.

### Indeksi:
```sql
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```
Indeks je kao sadrzaj u knjizi — umesto da cita svaki red, baza skoci direktno na trazene podatke. Kriticno za:
- Kuhinja koja trazi SAMO `status = 'new'` ili `status = 'preparing'` porudzbine
- Sortiranje po datumu (najnovije prvo)

---

## 6. Supabase — Backend-as-a-Service

### Sta je Supabase?
Supabase je hosted PostgreSQL baza sa dodatnim servisima (Realtime, Auth, Storage, Edge Functions). Open-source alternativa Firebase-u, ali koristi SQL (relacionu bazu) umesto NoSQL-a.

### Sta pruza Supabase u ovom projektu:

| Servis | Koriscen | Opis |
|--------|----------|------|
| **Database** | Da | PostgreSQL baza — orders tabela |
| **Realtime** | Da | WebSocket kanal za kuhinju i pracenje |
| **Auth** | Ne | Nema korisnickih naloga u v1 |
| **Storage** | Ne | Slike su u /public folderu |
| **Edge Functions** | Ne | API rute su u Next.js |

### Supabase JavaScript klijent:
Supabase pruza `@supabase/supabase-js` biblioteku koja omata SQL upite u JavaScript metode:

```typescript
// SQL ekvivalent: INSERT INTO orders (...) VALUES (...) RETURNING id;
const { data, error } = await supabase
  .from("orders")
  .insert({ customer_name: "Marko", ... })
  .select("id")
  .single();

// SQL ekvivalent: SELECT * FROM orders WHERE status IN ('new','preparing')
//                 AND created_at >= '...' ORDER BY created_at DESC;
const { data } = await supabase
  .from("orders")
  .select("*")
  .in("status", ["new", "preparing"])
  .gte("created_at", twoHoursAgo)
  .order("created_at", { ascending: false });

// SQL ekvivalent: UPDATE orders SET status = 'preparing' WHERE id = '...';
await supabase
  .from("orders")
  .update({ status: "preparing" })
  .eq("id", orderId);
```

### Supabase vs direktni PostgreSQL:
| Aspekt | Direktan PostgreSQL | Supabase |
|--------|-------------------|----------|
| Hosting | Sam upravljas serverom | Supabase hostuje |
| Realtime | Moraš sam implementirati | Ugradjeno |
| Dashboard | pgAdmin ili CLI | Web GUI sa Table Editor |
| Konekcija | Connection string | URL + API key |
| Cena | Zavisno od VPS-a | Besplatan do 500MB |

### Besplatan tier ogranicenja:
- 500MB baza
- 2 projekta
- 50,000 API zahteva mesecno
- 500 simultanih Realtime konekcija
- **Za malu restoran aplikaciju — vise nego dovoljno**

---

## 7. Supabase Realtime — WebSocket komunikacija

### Sta je WebSocket?
HTTP je "pitaj-odgovori" protokol — klijent pita, server odgovori, konekcija se zatvori. WebSocket je **stalna dvosrmenra konekcija** — jednom otvorena, obe strane mogu slati poruke u bilo kom trenutku.

### Razlika:
```
HTTP (polling — stari nacin):
  Kuhinja: "Ima nova porudzbina?"  →  Server: "Ne."
  (1 sek)
  Kuhinja: "Ima nova porudzbina?"  →  Server: "Ne."
  (1 sek)
  Kuhinja: "Ima nova porudzbina?"  →  Server: "DA! Evo je."
  Problem: Gomila nepotrebnih zahteva, kasni do 1 sekunde

WebSocket (realtime — koriscen u projektu):
  Kuhinja: "Otvori konekciju i obavesti me kad bude promena."
  Server: (konekcija ostaje otvorena)
  ... 5 minuta prolazi, nema promene ...
  Server: "NOVA PORUDZBINA! Evo podataka."  (instant, 0 kasnjenja)
  Server: "STATUS PROMENJEN na preparing."   (instant)
```

### Kako Supabase Realtime radi interno:
```
1. PostgreSQL tabela `orders` ima ukljucen Realtime:
   ALTER PUBLICATION supabase_realtime ADD TABLE orders;

2. Kad se dogodi INSERT ili UPDATE, PostgreSQL emituje event

3. Supabase Realtime engine hvata event i salje ga svim
   pretplacenim WebSocket klijentima

4. Browser prima event i azurira React stanje
```

### Dva Realtime paterna u projektu:

**Kuhinja — slusa SVE promene:**
```typescript
supabase.channel("orders-realtime")
  .on("postgres_changes", { event: "INSERT", table: "orders" }, ...)  // Nove
  .on("postgres_changes", { event: "UPDATE", table: "orders" }, ...)  // Azurirane
  .subscribe();
```
- Prima SVE nove porudzbine i SVE promene statusa
- Potrebno jer kuhinja prikazuje SVE aktivne porudzbine

**Pracenje porudzbine — slusa JEDNU porudzbinu:**
```typescript
supabase.channel(`order-${id}`)
  .on("postgres_changes", {
    event: "UPDATE",
    table: "orders",
    filter: `id=eq.${id}`,  // SAMO ova porudzbina
  }, ...)
  .subscribe();
```
- Prima SAMO promene za jednu konkretnu porudzbinu
- Efikasnije — ne salje podatke koje gost ne treba da vidi

### Cleanup (otpis):
```typescript
// Kad se komponenta ukloni (korisnik napusti stranicu):
return () => {
  supabase.removeChannel(channel);
  // Zatvara WebSocket kanal — ne trosi resurse na serveru
};
```

---

## 8. Resend — Email servis

### Sta je Resend?
Resend je email delivery servis — salje email-ove programski preko API-ja. Umesto SMTP konfiguracije (komplikovano, nesigurno), pozoves jedan API endpoint i email je poslat.

### Zasto ne Gmail SMTP / Nodemailer?
| Aspekt | Gmail SMTP | Resend API |
|--------|-----------|------------|
| Setup | Komplikovan (app passwords, SMTP config) | 1 API kljuc |
| Pouzdanost | Gmail moze blokirati "sumnjive" emailove | Namenski za slanje |
| Limit | 500/dan (Gmail), moze se blokirati | 100/dan besplatno, 50k/mesec na planu |
| Deliverability | Moze zavrsiti u spam-u | Optimizovano za inbox |
| Kod | 15+ linija konfiguracije | 5 linija |

### Kako Resend radi u projektu:
```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "Месара Шишко <onboarding@resend.dev>",  // Posiljalac
  to: process.env.RESTAURANT_EMAIL,                // Primalac (vlasnik)
  subject: `Нова поруџбина — ${name}`,             // Naslov
  html: `<div>...</div>`,                          // HTML telo email-a
});
```

### Tok email-a u sistemu:
```
Gost posalje porudzbinu
       ↓
POST /api/order
       ↓
1. Sacuvaj u Supabase       ← UVEK se desi
2. Pokusaj slanje email-a   ← MOZE da ne uspe
       ↓
Resend API prima zahtev
       ↓
Resend generise email i salje ga
       ↓
Email stize u inbox vlasnika (~5 sekundi)
```

### Besplatan tier:
- 100 email-ova dnevno
- Slanje SA `onboarding@resend.dev` adrese
- Slanje SAMO NA email sa kojim si se registrovao
- Za produkciju: verifikuj domen → slanje sa `porudzbine@mesara-sisko.rs`

### HTML sablon email-a:
Email koristi inline CSS (jer email klijenti ne podrzavaju CSS klase):
```html
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <h1 style="color:#A61C1C;border-bottom:2px solid #A61C1C;">
    Нова поруџбина
  </h1>
  <table>
    <tr><td>Име:</td><td><b>Марко</b></td></tr>
    <tr><td>Телефон:</td><td><b>064...</b></td></tr>
  </table>
  <!-- Tabela sa stavkama -->
  <div style="background:#A61C1C;color:white;...">
    Укупно: 1,680 дин
  </div>
</div>
```

---

## 9. Environment varijable — Konfiguracija

### Sta su environment varijable?
Vrednosti koje se cuvaju VAN koda — u `.env` fajlu ili u sistemu. Koriste se za tajne kljuceve, URL-ove servisa, i konfiguraciju koja se razlikuje izmedju okruzenja (lokalno vs produkcija).

### Zasto ne hard-kodirati u kod?
```typescript
// LOSE — kljuc je u kodu, vidljiv na GitHub-u:
const resend = new Resend("re_tajni_kljuc_123");

// DOBRO — kljuc je u env varijabli, ne ide na GitHub:
const resend = new Resend(process.env.RESEND_API_KEY);
```

### Kako Next.js tretira env varijable:

**Sa `NEXT_PUBLIC_` prefiksom:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
- Dostupne i na serveru i u browser-u
- Next.js ih UGRADJUJE u JavaScript bundle koji ide u pregledac
- Koristi ih SAMO za javne vrednosti (URL baze, anon kljuc)
- Anon kljuc je bezbedan za browser jer RLS politike ogranicavaju pristup

**Bez prefiksa:**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
RESTAURANT_EMAIL=info@...
```
- Dostupne SAMO na serveru (u API rutama)
- NIKADA ne stizu do browser-a
- Koristi ih za tajne kljuceve

### Hijerarhija ucitavanja:
```
1. .env                 ← Bazne vrednosti
2. .env.local           ← Lokalno override (ima prioritet)
3. .env.production      ← Samo u production build-u
4. Sistemske env var.   ← Najveci prioritet (Docker, Vercel)
```

### Validacija u kodu:
```typescript
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase env vars not configured");
    // Eksplicitna greska → odmah znas sta fali
  }
  return createClient(url, serviceRoleKey);
}
```

---

## 10. Docker — Kontejnerizacija

### Sta je Docker?
Docker pakuje aplikaciju sa SVIM zavisnostima (Node.js, npm paketi, konfig) u jedan "kontejner" koji radi isto na svakom racunaru. "Radi na mojoj masini" problem vise ne postoji.

### Zasto Docker za ovu aplikaciju?
- Restoran moze da pokrene aplikaciju na bilo kom serveru/racunaru
- Nema "instaliraj Node, pa npm install, pa..." — sve je u kontejneru
- Ako nesto podje naopako, restartuj kontejner i vraca se u cisto stanje

### Multi-stage Dockerfile (3 faze):

**Faza 1: deps — Instalacija zavisnosti**
```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
```
- `node:22-alpine` — minimalisticki Node.js image (120MB umesto 900MB)
- `npm ci` (ne `npm install`) — precizna instalacija iz lock fajla (reproducibilna)
- Kopira SAMO package*.json — Docker kesira ovaj sloj dok se zavisnosti ne promene

**Faza 2: builder — Build aplikacije**
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
```
- Kopira node_modules iz prethodne faze
- Kopira sav izvorni kod
- Pokrece `next build` koji generise optimizovan production build

**Faza 3: runner — Produkcijski kontejner**
```dockerfile
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 4200
CMD ["node", "server.js"]
```
- Kreira non-root korisnika `nextjs` (sigurnosni best practice)
- Kopira SAMO production fajlove (ne izvorni kod, ne node_modules)
- `standalone` output = Next.js generise `server.js` sa svim zavisnostima ugradjenim
- Pokrece se sa `node server.js` (ne `npm start` — brze, manje overhead-a)

### Zasto 3 faze?
Svaka faza koristi samo ono sto joj treba. Finalni image nema:
- Izvorni TypeScript kod
- devDependencies (eslint, typescript, tailwind)
- node_modules (ugradjeno u standalone)
- Build alate

**Rezultat:** ~150MB umesto ~1GB

### docker-compose.yml:
```yaml
services:
  web:
    build: .
    ports:
      - "4200:4200"          # Host port : Container port
    environment:
      - NODE_ENV=production
    restart: unless-stopped  # Automatski restart pri padu
```
- Za dodavanje env varijabli u produkciji: `env_file: .env`

---

## 11. Sigurnosni obrasci

### 11.1 Row Level Security (RLS)
PostgreSQL RLS ogranicava KO moze STA da radi sa podacima, na nivou baze:
```sql
-- Cak i ako neko nadje anon kljuc, moze SAMO:
-- Citati porudzbine (SELECT)
-- Kreirati porudzbine (INSERT)
-- Azurirati porudzbine (UPDATE)
-- NE MOZE brisati (DELETE) — nema politike za DELETE
```

### 11.2 Dvostruki kljuc sistem
```
anon key (javni)         → Ogranicene dozvole → Browser
service_role key (tajni) → Sve dozvole        → Server (API rute)
```
Browser nikad nema pristup service_role kljucu jer nema `NEXT_PUBLIC_` prefiks.

### 11.3 Validacija na serveru
Frontend validacija (HTML `required` atribut) se moze zaobici. Zato server UVEK ponovo validira:
```typescript
if (!name || !phone || !items || !Array.isArray(items) || items.length === 0) {
  return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
}
```

### 11.4 Non-root Docker korisnik
```dockerfile
RUN adduser --system --uid 1001 nextjs
USER nextjs
```
Ako neko nadje ranjivost u aplikaciji, ima ogranicen pristup sistemu (ne root).

### 11.5 .env u .gitignore
`.env` fajl NIKAD ne ide na GitHub. Sadrzi tajne kljuceve koji bi omogucili pristup bazi i email servisu.

### 11.6 CHECK constraints u bazi
```sql
CHECK (status IN ('new', 'preparing', 'done'))
```
Cak i ako bag u kodu posalje neispravan status, baza ce odbiti INSERT/UPDATE.

---

## 12. Obrasci dizajna u backend-u

### 12.1 Non-blocking email (Fire-and-Forget sa oporavkom)
```typescript
// Porudzbina se PRVO sacuva u bazu
const { data: order } = await supabase.from("orders").insert({...});

// ZATIM se pokusa slanje email-a u zasebnom try/catch
try {
  await resend.emails.send({...});
} catch (emailError) {
  console.error("Email failed — order still saved");
}

// Odgovor se UVEK vraca klijentu
return NextResponse.json({ success: true, orderId: order.id });
```
Gost NIKAD ne dobija gresku zbog neuspelog email-a.

### 12.2 Fail-fast validacija
Validacija je PRVA stvar u handler-u. Ako podaci fale, odmah vrati gresku — ne trosi resurse na bazu/email:
```typescript
export async function POST(request) {
  const body = await request.json();
  if (!body.name) return error(400);   // ← Odmah vrati
  // ... tek sad radi sa bazom ...
}
```

### 12.3 Pub/Sub patern (Realtime)
Publisher (API ruta) ne zna ko slusa. Subscriber (kuhinja, pracenje) ne zna ko salje.
```
API ruta → INSERT u bazu → Supabase emituje event
                            ↓
              Kuhinja prima event (subscriber 1)
              Pracenje prima event (subscriber 2)
              Bilo ko moze se pretplatiti (subscriber N)
```

### 12.4 Singleton Supabase klijent
```typescript
const supabaseRef = useRef<SupabaseClient | null>(null);
if (typeof window !== "undefined" && !supabaseRef.current) {
  supabaseRef.current = createBrowserSupabaseClient();
}
```
Kreira se JEDAN klijent po komponenti (ne novi na svaki re-render). `useRef` cuva referencu izmedju renderovanja bez izazivanja re-rendera.

### 12.5 Graceful degradation na klijentu
Korpa salje porudzbinu i ako API padne, prikazuje staticnu poruku uspeha:
```typescript
try {
  const res = await fetch("/api/order", {...});
  if (data.orderId) { redirect(...); return; }
} catch {
  // Fallback — nemoj prikazati gresku, prikazi poruku uspeha
}
setOrderSent(true);
```

---

## 13. Kako frontend i backend komuniciraju

### Kompletna sekvenca jedne porudzbine:

```
FRONTEND (Browser)                    BACKEND (Server)                 BAZA (Supabase)
──────────────────                    ──────────────────               ─────────────────
1. Gost dodaje stavke u korpu
   (Zustand → localStorage)
         |
2. Gost klikne "Posalji"
         |
3. fetch("/api/order", {              4. POST handler prima zahtev
     method: "POST",                      |
     body: JSON.stringify({           5. Validacija (ime, telefon, stavke)
       name, phone, items, total          |
     })                               6. createServerSupabaseClient()
   })                                     |
         |                            7. supabase.insert({...})  ───→  8. INSERT INTO orders
         |                                |                                    |
         |                            9. resend.emails.send()          10. Realtime event emitovan
         |                                |                                    |
         |                           11. return { orderId }                    |
         |                                |                                    ↓
12. Primi orderId                         |                           13. Kuhinja prima event
         |                                                                (WebSocket)
13. redirect(/porudzbina/id)                                               |
         |                                                            14. playChime() + prikazi
14. Komponenta ucitava porudzbinu ←──── supabase.select() ───→   15. Citanje iz baze
         |
15. Komponenta se subscribuje ←──── WebSocket konekcija ───→    16. Slusa UPDATE events
         |
16. Kuhinja menja status ──→ supabase.update() ──→              17. UPDATE u bazi
         |                                                               |
18. Gost vidi novu status ←──── Realtime event ←────────────────  18. Event emitovan
```

### Tokovi podataka:

| Tok | Smer | Protokol | Podaci |
|-----|------|----------|--------|
| Slanje porudzbine | Frontend → Backend | HTTP POST | JSON (ime, telefon, stavke, ukupno) |
| Odgovor sa ID-om | Backend → Frontend | HTTP Response | JSON (orderId) |
| Citanje porudzbine | Frontend → Supabase | HTTP GET | SQL query rezultat |
| Nove porudzbine | Supabase → Kuhinja | WebSocket | INSERT payload |
| Promena statusa | Supabase → Gost | WebSocket | UPDATE payload |
| Status update | Kuhinja → Supabase | HTTP PATCH | Novi status |
| Email obavestavnje | Backend → Resend → Vlasnik | HTTP + SMTP | HTML email |
