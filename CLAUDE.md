# Mesara Sisko - QR Menu Web App

## Technical Reference for Claude Code

### Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5.9
- **Styling**: Tailwind CSS v4 (via @tailwindcss/postcss)
- **State**: Zustand 5 (`src/lib/cart-store.ts`)
- **i18n**: next-intl 4.8 — Serbian (Cyrillic) + English
- **Animations**: Framer Motion 12 | **Icons**: Lucide React
- **Container**: Docker (Node 22 Alpine, port 4200)

### Project Structure
```
src/
  app/[locale]/          # Pages: home, meni, o-nama, galerija, kontakt, lokacija, zabava, korpa
  app/api/               # API routes: order, contact (email integration TODO)
  components/layout/     # Header, Footer, LanguageSwitcher
  components/menu/       # MenuItem, MenuCategory, MenuSearch, CartButton
  components/effects/    # EmberParticles
  data/                  # menu.ts, combos.ts, toppings.ts, quiz-adults.ts, quiz-kids.ts
  lib/                   # utils.ts, constants.ts, cart-store.ts
  messages/              # sr.json, en.json
  i18n/                  # routing.ts, request.ts, navigation.ts
```

### Coding Conventions
- **Path alias**: `@/` maps to `./src/`
- **Serbian text**: Always Cyrillic script in data files and translations
- **Bilingual**: Every user-facing string must exist in both `sr.json` and `en.json`
- **Menu data**: Items have `name` (Cyrillic) + `nameEn` (English) fields
- **Pricing**: Serbian Dinars (RSD/din), `sr-RS` locale formatting
- **Colors**: Primary accent red `#A61C1C`, charcoal/cream/wood palette
- **Mobile-first**: Primary use is QR scan on phones
- **No overengineering**: Small restaurant app, keep it simple
- **Protected files**: Do not modify `.env*`, `package-lock.json`, or `docker-compose.yml` without asking

### Commands
```bash
npm run dev      # Dev server on port 4200
npm run build    # Production build
npm run lint     # ESLint check
```

### Sprint Tracking
All sprint plans in `dokumentacija/sprintovi.md`

---

## Specifikacije Aplikacije

Uvod u specifikacije aplikacije
Naziv aplikacije: Web aplikacija za „Роштиљ месара Шишко - Чајетина “ – digitalni QR meni sa interaktivnim elementima i online naručivanjem.
Cilj: Povećanje posećenosti restorana za 20–40% kroz privlačenje porodica, produženje vremena boravka gostiju i lakše naručivanje, fokusirano na rast biznisa na Zlatiboru.
Korisnici: Gosti (mobilni pregled menija), vlasnik (pregled porudžbina), porodice sa decom (zabavni sadržaj).

Tehničke specifikacije
Tehnološki stack: Next.js (frontend/backend), Supabase (baza), Tailwind CSS (stil), Vercel (hosting), next-intl (višejezičnost: srpski/engleski).
Responsivnost: Prioritet mobilnim uređajima (QR skeniranje za stolove), brzo učitavanje slika sa Next.js Image.
Integracije: Google Business Profile (mapa, recenzije), Google Analytics (praćenje poseta), email notifikacije za porudžbine.
Sigurnost: Bez autentifikacije u v1, ali HTTPS obavezan; podaci porudžbina čuvani samo za interni pregled.

Funkcionalnosti aplikacije
Osnovne stranice:
Početna (hero sa slikama roštilja, poziv na akciju za meni).
O nama (opis restorana, istorija, benefiti za goste).
Galerija (slike objekta spolja/unutra i 24 slike jela).
Kontakt (forma za upite, broj telefona, email).
Lokacija (Google Maps embed sa tačnom adresom u Čajetini).

Digitalni meni:
Kategorije: Roštilj na kilo, Roštilj u lepinji, Riba, Dodaci i lepinje, Salate i dodaci, Piće (sa cenama, opisima, slikama).
Funkcije: Pretraga jela, akordeon za kategorije, dodavanje u korpu za naručivanje.

Interaktivna zabava:
Sekcija „Zabava dok čekate“ – kviz za odrasle (slagalica o roštilju/Zlatiboru), 2–4 edukativne igrice za decu (memory parovi, sastavi obrok, kviz za decu, boji sliku).
Benefiti: Produžava boravak za 10–15 minuta, povećava porudžbine pića/deserata.

Online naručivanje:
Korpa sa stavkama iz menija, forma (ime, telefon, napomena).
Slanje porudžbine: Email vlasniku + realtime prikaz u Supabase dashboard-u (opciono iskačući prozor na računaru u restoranu).
Plaćanje: Samo u objektu (gotovina/kartica), legalno za pickup u Srbiji.

Podaci koje treba uključiti pri izradi
Meni podaci: Kompletan spisak stavki sa cenama ( podaci se nalaze u fajlu meniPodaci.txt ), kategorije, opisi (dodati kratke za svako jelo za SEO).
Slike: 24 slike jela (roštilj na kilo/u lepinji), slike objekta (spolja/unutra, dodati kasnije); optimizovati za web (kompresija <100KB po slici), svaka slika se nalazi u folderu "web-app/slike"
Tekstovi: O nama (istorija restorana, specijaliteti), Kontakt (adresa: Čajetina, telefon, email), Lokacija (koordinate za mapu).
Prevodi: Svi tekstovi na engleski (za turiste na Zlatiboru), uključujući meni stavke (npr. „Mixed fresh meat for grill“).
Dodatni podaci: Pitanja za kviz (10–15 za odrasle, 10 za decu), ikone za igrice (besplatne iz Unsplash ili SVG), Google Business link za integraciju.

Poslovni benefiti i rast
Povećana vidljivost: SEO optimizacija za „roštilj Zlatibor“ dovodi više turista.
Veći promet: Zabavni sadržaj privlači porodice, online naručivanje smanjuje čekanje i greške.
Analitika: Praćenje poseta stranica (npr. koliko puta otvoren meni) za optimizaciju ponude.
Skalabilnost: Lako dodavanje dostave ili online plaćanja u budućim sprintovima za dalji rast.

Plan implementacije
Agile sprintovi: 0 (priprema), 1 (stranice), 2 (meni), 3 (naručivanje), 4 (zabava), 5 (lansiranje);
Testiranje: Responsivnost na mobilnim, realtime porudžbine, korisničko iskustvo za decu.
Lansiranje: Generisanje QR kodova za stolove, obuka osoblja za pregled porudžbina.
