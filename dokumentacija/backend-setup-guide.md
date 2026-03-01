# Backend Setup Guide - Mesara Sisko

Ovaj dokument objasnjava korak po korak kako da instaliras i pokrenes backend deo aplikacije.

---

## Preduslovi (vec imas instalirano)

| Alat    | Tvoja verzija | Minimalna |
|---------|--------------|-----------|
| Node.js | v20.15.0     | v18+      |
| npm     | 10.8.1       | 9+        |
| Docker  | 26.1.4       | 20+       |

---

## KORAK 1: Kreiranje Supabase projekta (baza podataka)

Supabase je besplatan PostgreSQL servis u oblaku koji cuva porudzbine i pruza realtime azuriranja za kuhinju.

### 1.1 Registracija
1. Idi na **https://supabase.com** i klikni **Start your project**
2. Uloguj se sa GitHub nalogom (ili kreiraj nalog sa email-om)
3. Klikni **New Project**
4. Popuni:
   - **Name**: `mesara-sisko`
   - **Database Password**: zapamti ovu lozinku (sacuvaj negde)
   - **Region**: izaberi **Central EU (Frankfurt)** - najblizi Srbiji
5. Klikni **Create new project** i sacekaj ~2 minuta da se kreira

### 1.2 Kopiranje API kljuceva
1. U Supabase dashboardu idi na **Settings** > **API** (u levom meniju)
2. Kopiraj sledece vrednosti (trebace ti za `.env` fajl):
   - **Project URL** → ovo je `NEXT_PUBLIC_SUPABASE_URL` (izgleda kao `https://abcdefgh.supabase.co`)
   - **anon public** key → ovo je `NEXT_PUBLIC_SUPABASE_ANON_KEY` (dugacak JWT token)
   - **service_role secret** key → ovo je `SUPABASE_SERVICE_ROLE_KEY` (dugacak JWT token)

> **VAZNO**: `service_role` kljuc je tajni. Nikad ga ne stavljaj u frontend kod ili na GitHub.

### 1.3 Kreiranje `orders` tabele
1. U Supabase dashboardu idi na **SQL Editor** (u levom meniju)
2. Klikni **New Query**
3. Kopiraj i zalepi sledeci SQL:

```sql
-- Kreiranje orders tabele
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  note TEXT DEFAULT '',
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  order_details TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'done')),
  estimated_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indeks za brze pretrage po statusu
CREATE INDEX idx_orders_status ON orders(status);

-- Indeks za brze pretrage po datumu
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Ukljuci Realtime za orders tabelu (potrebno za kuhinju)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
```

4. Klikni **Run** (zeleno dugme)
5. Trebalo bi da vidis poruku "Success. No rows returned" - to znaci da je tabela uspesno kreirana

### 1.4 Podesavanje Row Level Security (RLS)
1. Ostani u **SQL Editor**
2. Pokreni novi upit:

```sql
-- Ukljuci RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Dozvoli svima da citaju porudzbine (za kuhinju i pracenje)
CREATE POLICY "Allow public read" ON orders
  FOR SELECT USING (true);

-- Dozvoli anonimnim korisnicima da kreiraju porudzbine (za korpu)
CREATE POLICY "Allow public insert" ON orders
  FOR INSERT WITH CHECK (true);

-- Dozvoli service role da azurira porudzbine (za API rute)
CREATE POLICY "Allow service update" ON orders
  FOR UPDATE USING (true);
```

3. Klikni **Run**

### 1.5 Verifikacija
1. Idi na **Table Editor** u levom meniju
2. Trebalo bi da vidis `orders` tabelu sa svim kolonama
3. Tabela je prazna - to je u redu, porudzbine ce se pojaviti kad testiras

---

## KORAK 2: Kreiranje Resend naloga (email obavestavanja)

Resend je email servis koji salje obavestvanja o novim porudzbinama.

### 2.1 Registracija
1. Idi na **https://resend.com** i klikni **Get Started**
2. Uloguj se sa GitHub nalogom ili email-om
3. Besplatan plan dozvoljava 100 email-ova dnevno (dovoljno za testiranje)

### 2.2 Kreiranje API kljuca
1. U Resend dashboardu idi na **API Keys** (u levom meniju)
2. Klikni **Create API Key**
3. Daj ime kljucu: `mesara-sisko`
4. Dozvole: **Full Access**
5. Klikni **Create** i **ODMAH KOPIRAJ KLJUC** (prikaze se samo jednom!)
   - Izgleda kao: `re_AbCdEf123456...`
   - Ovo je tvoj `RESEND_API_KEY`

> **NAPOMENA za testiranje**: Dok ne verifikujes sopstveni domen u Resend-u, email-ovi se salju sa `onboarding@resend.dev` i mogu se slati SAMO na tvoj email (email sa kojim si se registrovao). Za produkciju ces morati da dodas i verifikujes domen.

---

## KORAK 3: Kreiranje `.env` fajla

### 3.1 Kreiranje fajla
1. U terminalu navigiraj do projekta:
```bash
cd "C:/Users/Ratko Sisovic/Desktop/Mesara/web-app"
```

2. Kopiraj primer:
```bash
cp .env.example .env
```

### 3.2 Popunjavanje vrednosti
Otvori `.env` fajl u editoru i zameni placeholder vrednosti:

```env
# Email — tvoj email za prijem obavestavanja o porudzbinama
RESTAURANT_EMAIL=tvoj-email@gmail.com

# Resend API kljuc (iz Koraka 2)
RESEND_API_KEY=re_tvoj_api_kljuc_ovde

# Supabase (iz Koraka 1.2)
NEXT_PUBLIC_SUPABASE_URL=https://tvoj-projekat.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App URL (za lokalno testiranje)
NEXT_PUBLIC_APP_URL=http://localhost:4200
```

> **VAZNO**: `.env` fajl je vec u `.gitignore` — NIKADA ga ne unosite na GitHub!

---

## KORAK 4: Instalacija zavisnosti

```bash
cd "C:/Users/Ratko Sisovic/Desktop/Mesara/web-app"
npm install
```

Ovo instalira sve potrebne pakete:
- `@supabase/supabase-js` — klijent za Supabase bazu
- `resend` — klijent za slanje email-ova
- `next` — web framework (server + frontend)
- `zustand` — upravljanje stanjem korpe
- i ostale zavisnosti...

Ocekivani rezultat: `added X packages in Y s` bez gresaka.

---

## KORAK 5: Pokretanje razvojnog servera

```bash
npm run dev
```

Ocekivani ispis:
```
  ▲ Next.js 16.1.6
  - Local:    http://localhost:4200
  - Network:  http://192.168.x.x:4200

 ✓ Ready in Xs
```

Aplikacija je sada dostupna na **http://localhost:4200**

---

## KORAK 6: Testiranje backend-a

### 6.1 Testiranje menija i korpe
1. Otvori **http://localhost:4200/sr/meni** u pregledacu
2. Dodaj neke stavke u korpu
3. Idi na korpu (**http://localhost:4200/sr/korpa**)
4. Popuni ime i telefon
5. Posalji porudzbinu

### 6.2 Provera u Supabase-u
1. Idi na Supabase dashboard > **Table Editor** > `orders`
2. Trebalo bi da vidis novu porudzbinu sa statusom `new`

### 6.3 Provera email-a
1. Ako si pravilno podesio Resend, proveri inbox email-a koji si stavio u `RESTAURANT_EMAIL`
2. Trebalo bi da dobijes email sa naslovom "Нова поруџбина — [Ime]"
3. Ako koristis besplatan plan bez verifikovanog domena, email mora ici na isti email sa kojim si se registrovao na Resend

### 6.4 Testiranje kuhinje (realtime)
1. Otvori **http://localhost:4200/kuhinja** u novom tabu
2. Klikni "Кликни да покренеш приказ"
3. Posalji novu porudzbinu iz korpe (u drugom tabu)
4. Porudzbina bi trebalo da se pojavi ODMAH na kuhinjskom ekranu sa zvucnim signalom
5. Klikni na crveno dugme "НОВО" da promenis status u "ПРИПРЕМА СЕ"
6. Klikni ponovo da promenis u "ГОТОВО"

### 6.5 Testiranje pracenja porudzbine
1. Nakon slanja porudzbine, zapamti ID porudzbine (vraca se u odgovoru)
2. Ili kopiraj UUID iz Supabase tabele
3. Otvori **http://localhost:4200/porudzbina/[UUID-OVDE]**
4. Trebalo bi da vidis status porudzbine u realnom vremenu
5. Promeni status u kuhinjskom tabu — trebalo bi automatski da se azurira

---

## KORAK 7: Pokretanje sa Docker-om (opciono)

Ako zelis da testiras produkcijsku verziju:

```bash
# Build i pokretanje kontejnera
docker-compose up --build

# Ili u pozadini
docker-compose up --build -d
```

Aplikacija ce biti dostupna na **http://localhost:4200** (isti port).

Za zaustavljanje:
```bash
docker-compose down
```

---

## Troubleshooting (cesti problemi)

### "Supabase env vars not configured"
- Proveri da li `.env` fajl postoji u root-u projekta (`web-app/.env`)
- Proveri da li si pravilno kopirao URL i kljuceve (bez razmaka na pocetku/kraju)
- Restartuj dev server (`Ctrl+C` pa `npm run dev`)

### Porudzbina se ne cuva u bazi
- Proveri Supabase dashboard > **Table Editor** > da li tabela `orders` postoji
- Proveri browser konzolu (F12 > Console) za greske
- Proveri terminal gde radi `npm run dev` za server greske

### Email se ne salje
- Proveri da li je `RESEND_API_KEY` ispravan
- Na besplatnom planu, email se moze slati SAMO na email sa kojim si se registrovao
- Porudzbina se IPAK cuva u bazi cak i ako email ne uspe (non-blocking dizajn)

### Kuhinja ne prima realtime azuriranja
- Proveri da si pokrenuo SQL iz Koraka 1.3 (narocito `ALTER PUBLICATION supabase_realtime ADD TABLE orders`)
- Osvezi stranicu kuhinje
- Proveri da koristis isti Supabase projekat (isti URL u `.env`)

### `npm install` ne radi
- Proveri internet konekciju
- Obrisi `node_modules` i `package-lock.json` pa ponovo pokreni:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## Rezime arhitekture backend-a

```
Korisnik (telefon)          Vlasnik (kuhinja)
     |                            |
     | POST /api/order            | GET realtime
     v                            v
  ┌─────────────┐         ┌─────────────┐
  │  Next.js    │         │  /kuhinja   │
  │  API Route  │         │  (browser)  │
  └──────┬──────┘         └──────┬──────┘
         |                       |
         |  insert               | subscribe
         v                       v
  ┌──────────────────────────────────────┐
  │         Supabase (PostgreSQL)        │
  │         orders tabela                │
  │         + Realtime engine            │
  └──────────────────────────────────────┘
         |
         | email (non-blocking)
         v
  ┌─────────────┐
  │   Resend    │ → Email vlasniku
  └─────────────┘
```

**Tok porudzbine:**
1. Gost popuni korpu i posalji porudzbinu
2. `POST /api/order` prima podatke, validira ih
3. Cuva porudzbinu u Supabase `orders` tabelu (status: `new`)
4. Salje email obavestavanja vlasniku (ne blokira — ako email padne, porudzbina je vec sacuvana)
5. Vraca `orderId` gostu za pracenje
6. Kuhinja prima novu porudzbinu u realnom vremenu (Supabase Realtime)
7. Kuhinja menja status: `new` → `preparing` → `done`
8. Gost vidi promenu statusa u realnom vremenu na `/porudzbina/[id]`
