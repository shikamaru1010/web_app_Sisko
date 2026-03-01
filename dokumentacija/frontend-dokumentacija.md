# Frontend Dokumentacija - Mesara Sisko

Kompletan pregled svih frontend tehnologija, jezika, biblioteka, komponenti i obrazaca koriscenih u aplikaciji.

---

## SADRZAJ

1. [Tehnoloski stek (jezici i alati)](#1-tehnoloski-stek)
2. [Next.js — framework](#2-nextjs--framework)
3. [React 19 — UI biblioteka](#3-react-19--ui-biblioteka)
4. [TypeScript — jezik](#4-typescript--jezik)
5. [Tailwind CSS v4 — stilizovanje](#5-tailwind-css-v4--stilizovanje)
6. [Framer Motion — animacije](#6-framer-motion--animacije)
7. [Zustand — upravljanje stanjem](#7-zustand--upravljanje-stanjem)
8. [next-intl — visejezicnost (i18n)](#8-next-intl--visejezicnost-i18n)
9. [Lucide React — ikone](#9-lucide-react--ikone)
10. [Komponente — struktura i objasnjenje](#10-komponente)
11. [Stranice — struktura i objasnjenje](#11-stranice)
12. [CSS sistem — custom stilovi](#12-css-sistem)
13. [Podaci (data sloj)](#13-podaci-data-sloj)
14. [Konfiguracioni fajlovi](#14-konfiguracioni-fajlovi)
15. [Obrasce dizajna korisceni u projektu](#15-obrasci-dizajna)

---

## 1. Tehnoloski stek

| Tehnologija | Verzija | Uloga | Zasto je izabrana |
|-------------|---------|-------|-------------------|
| **Next.js** | 16.1.6 | Full-stack web framework | Server-side rendering, API rute, optimizacija slika, routing |
| **React** | 19.2.3 | UI biblioteka | Komponentni pristup, hooks, brzo renderovanje |
| **TypeScript** | 5.9.3 | Programski jezik | Tipizacija spreci bagove pre pokretanja, bolja dokumentacija koda |
| **Tailwind CSS** | v4 | CSS framework | Utility klase, brz razvoj, konzistentan dizajn |
| **Framer Motion** | 12.34.0 | Animacije | Deklarativne animacije, React integracija, performanse |
| **Zustand** | 5.0.11 | State management | Lak, brz, bez boilerplate-a, localStorage persistencija |
| **next-intl** | 4.8.2 | Internacionalizacija | Srpski/engleski prevodi, lokalizovani URL-ovi |
| **Lucide React** | 0.563.0 | Ikone | Lepe SVG ikone, tree-shakable (samo ikone koje koristis) |

---

## 2. Next.js — Framework

### Sta je Next.js?
Next.js je React framework koji dodaje server-side rendering (SSR), routing, API rute i optimizaciju. Umesto cistog React-a gde se sve renderuje u browseru, Next.js moze da generise HTML na serveru pa ga posalje browseru — sto je brze za korisnika i bolje za SEO.

### App Router (Next.js 13+)
Ova aplikacija koristi **App Router** — noviji sistem rutiranja gde je struktura foldera = struktura URL-ova.

```
src/app/
├── layout.tsx              ← Root layout (obavija SVE stranice)
├── [locale]/               ← Dinamicki segment za jezik (sr ili en)
│   ├── layout.tsx          ← Locale layout (Header + Footer + prevodi)
│   ├── page.tsx            ← Pocetna stranica  → /sr/ ili /en/
│   ├── meni/page.tsx       ← Meni stranica     → /sr/meni ili /en/menu
│   ├── korpa/page.tsx      ← Korpa stranica    → /sr/korpa ili /en/cart
│   ├── o-nama/page.tsx     ← O nama            → /sr/o-nama ili /en/about
│   ├── galerija/page.tsx   ← Galerija          → /sr/galerija ili /en/gallery
│   ├── kontakt/page.tsx    ← Kontakt           → /sr/kontakt ili /en/contact
│   ├── lokacija/page.tsx   ← Lokacija          → /sr/lokacija ili /en/location
│   └── zabava/             ← Zabava sekcija    → /sr/zabava ili /en/fun
│       ├── page.tsx        ← Hub
│       ├── kviz/           ← Kviz za odrasle
│       ├── kviz-deca/      ← Kviz za decu
│       ├── memory/         ← Memory igra
│       └── sastavi-obrok/  ← Sastavi obrok
├── api/                    ← Backend API rute (NE renderuju HTML)
│   ├── order/route.ts
│   └── contact/route.ts
├── kuhinja/page.tsx        ← Kuhinjski dashboard (BEZ locale — direktan pristup)
└── porudzbina/[id]/page.tsx ← Pracenje porudzbine (BEZ locale)
```

### Kljucni koncepti:

**`page.tsx`** — Svaki folder koji ima `page.tsx` automatski postaje URL ruta.
```
src/app/[locale]/meni/page.tsx  →  /sr/meni  ili  /en/menu
```

**`layout.tsx`** — Obavija sve stranice unutar svog foldera. Koristi se za zajednicke elemente (Header, Footer).
```typescript
// src/app/[locale]/layout.tsx
export default async function LocaleLayout({ children, params }) {
  return (
    <html>
      <body>
        <Header />          {/* Prikazuje se na SVAKOJ stranici */}
        <main>{children}</main>  {/* Ovo je konkretna stranica */}
        <Footer />          {/* Prikazuje se na SVAKOJ stranici */}
      </body>
    </html>
  );
}
```

**`[locale]`** — Dinamicki segment. Vrednost u zagradi postaje parametar.
- `/sr/meni` → `locale = "sr"`
- `/en/menu` → `locale = "en"`

**`[id]`** — Takodje dinamicki segment za ID porudzbine.
- `/porudzbina/abc-123` → `id = "abc-123"`

**`"use client"`** — Direktiva na vrhu fajla koja znaci da se komponenta renderuje u browseru (potrebno za interaktivnost: useState, onClick, animacije). Bez ove direktive, komponenta je server komponenta.

### next.config.ts:
```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {
  output: "standalone",           // Za Docker — generise samostalan build
  images: {
    formats: ["image/webp", "image/avif"],  // Moderna kompresija slika
  },
};

export default withNextIntl(nextConfig);
```
- `output: "standalone"` — Next.js generise folder sa svime potrebnim za pokretanje (koristi se u Docker kontejneru)
- `images.formats` — Automatski konvertuje slike u WebP/AVIF format (manji fajlovi, brze ucitavanje)
- `withNextIntl` — Plugin koji aktivira internacionalizaciju

### Next.js Image komponenta:
```tsx
import Image from "next/image";

<Image
  src="/images/punRostilj.jpg"
  alt="Meso na rostilju"
  fill                    // Popuni roditeljski kontejner
  className="object-cover"
  sizes="(max-width: 640px) 80px, 96px"  // Responsivne velicine
  priority               // Ucitaj odmah (za hero slike)
  loading="lazy"         // Ucitaj kad dodje u viewport (za ostale)
/>
```
**Prednosti:**
- Automatska optimizacija (resize, kompresija, konverzija u WebP)
- Lazy loading (ucitava slike tek kad se vide na ekranu)
- Responsive sizes (razlicite velicine za razlicite ekrane)
- Blur placeholder dok se slika ucitava

---

## 3. React 19 — UI biblioteka

### Sta je React?
React je JavaScript biblioteka za pravljenje korisnickih interfejsa kroz komponente — male, ponovo upotrebljive delove interfejsa.

### Hooks korisceni u projektu:

| Hook | Sta radi | Gde se koristi |
|------|----------|----------------|
| `useState` | Lokalno stanje komponente | Meni (search, selected option), Korpa (form data), Header (mobile open) |
| `useEffect` | Pokretanje koda posle renderovanja | Kuhinja (realtime sub), Pocetna (ember timer), Header (mounted) |
| `useRef` | Referenca na DOM/objekat koji ne izaziva re-render | Kuhinja (supabase klijent), EmberParticles (canvas) |
| `useCallback` | Memoizacija funkcije | Kuhinja (initialize) |
| `useMemo` | Memoizacija vrednosti | Meni (filteredItems — da ne filtrira ponovo bez potrebe) |
| `useTransition` | Oznacavanje ne-urgentnih azuriranja | LanguageSwitcher (promena jezika) |

### Primer useState:
```tsx
const [search, setSearch] = useState("");  // search = "", setSearch menja vrednost

// Kad korisnik kuca:
<input value={search} onChange={(e) => setSearch(e.target.value)} />
// React automatski re-renderuje komponentu kad se search promeni
```

### Primer useEffect:
```tsx
useEffect(() => {
  // Ovaj kod se pokrece JEDNOM posle prvog renderovanja
  setMounted(true);
}, []);  // [] = prazan niz zavisnosti = pokreni samo jednom

useEffect(() => {
  // Ovaj kod se pokrece SVAKI PUT kad se `started` promeni
  if (!started) return;
  // ... subscribuj na realtime ...
  return () => { /* cleanup — otpis */ };
}, [started]);  // [started] = pokreni kad se started promeni
```

### Primer useMemo:
```tsx
const filteredItems = useMemo(() => {
  // Ova kalkulacija se pokrece SAMO kad se `search` promeni
  // Bez useMemo, pokrenula bi se na SVAKI re-render
  if (!search.trim()) return null;
  return menuData.flatMap(cat => cat.items.filter(...));
}, [search]);
```

### Komponentna hijerarhija:
```
RootLayout
└── LocaleLayout
    ├── Header
    │   ├── Logo (Image + Link)
    │   ├── NavLinks (Link x7)
    │   ├── LanguageSwitcher
    │   └── CartIcon (Link + badge)
    ├── Main Content (page-specific)
    │   ├── HomePage
    │   │   ├── EmberParticles (Canvas)
    │   │   ├── WhyUsCards (motion.div)
    │   │   └── PopularItems (Image cards)
    │   ├── MenuPage
    │   │   ├── MenuSearch
    │   │   ├── MenuCategory (accordion) x6
    │   │   │   └── MenuItem x(N per category)
    │   │   │       └── ToppingsSelector (optional)
    │   │   ├── ComboCards
    │   │   └── CartButton (floating, AnimatePresence)
    │   └── CartPage
    │       ├── CartItems (motion.div + quantity controls)
    │       ├── TotalSection (subtotal, discount, total)
    │       └── OrderForm (name, phone, note, submit)
    └── Footer
        ├── Brand/Logo
        ├── QuickLinks
        └── ContactInfo
```

---

## 4. TypeScript — Jezik

### Sta je TypeScript?
TypeScript je JavaScript sa tipovima. Umesto da se bag otkrije tek kad korisnik klikne dugme, TypeScript otkriva gresku dok pises kod.

### Tipovi korisceni u projektu:

**src/lib/types.ts:**
```typescript
export type OrderStatus = "new" | "preparing" | "done";
// Moze biti SAMO jedna od ove tri vrednosti. Bilo sta drugo → greska.

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  note: string;
  items: CartItem[];          // Niz CartItem objekata
  total: number;
  order_details: string;
  status: OrderStatus;        // "new" | "preparing" | "done"
  estimated_minutes: number | null;  // Moze biti broj ILI null
  created_at: string;
};
```

**src/lib/cart-store.ts:**
```typescript
export type CartItem = {
  id: string;
  name: string;          // Cirilica
  nameEn: string;        // English
  price: number;
  quantity: number;
  categoryId?: string;   // ? = opciono (moze i ne mora postojati)
  size?: string;
  sizeEn?: string;
  image?: string;
  composition?: CompositionEntry[];
};
```

**src/data/menu.ts:**
```typescript
export type MenuItem = {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  price?: number;            // Za stavke sa jednom cenom
  options?: MenuItemOption[];  // Za stavke sa vise velicina (150g, 200g)
  unit?: string;             // "кг" — za stavke na kilo
  unitEn?: string;           // "kg"
  image?: string;
};

export type MenuCategory = {
  id: string;
  name: string;              // "Роштиљ на кило"
  nameEn: string;            // "Grill by Kilo"
  icon: string;              // Emoji: "🔥"
  items: MenuItem[];         // Niz stavki u kategoriji
};
```

### Kljucni TypeScript obrasci u projektu:

**`as const`** — Cini objekat immutable (read-only):
```typescript
export const RESTAURANT = {
  name: { sr: "Роштиљ месара Шишко", en: "Grill Butcher Shop Šiško" },
} as const;
// RESTAURANT.name.sr se NE MOZE menjati u kodu
```

**`Omit<Type, Key>`** — Kreira novi tip bez odredjene osobine:
```typescript
addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
// Prihvata CartItem BEZ quantity polja (quantity se dodaje interno)
```

**`Record<Key, Value>`** — Mapa tipova:
```typescript
const statusColors: Record<OrderStatus, string> = {
  new: "#dc2626",       // Crvena
  preparing: "#d97706", // Narandzasta
  done: "#16a34a",      // Zelena
};
```

**`Props` tip za komponente:**
```typescript
type Props = {
  item: MenuItemType;
  categoryId: string;
  showToppings?: boolean;  // opciono
};

export default function MenuItem({ item, categoryId, showToppings = false }: Props) {
  // showToppings ima default vrednost false
}
```

---

## 5. Tailwind CSS v4 — Stilizovanje

### Sta je Tailwind?
Tailwind je CSS framework gde pises stilove direktno u HTML/JSX kao klase umesto da pravis zasebne CSS fajlove.

### Kako radi u ovom projektu:

**Konfiguracija** — `src/app/globals.css` definise temu:
```css
@import "tailwindcss";

@theme inline {
  --color-primary: #8a2029;       /* Tamnija crvena loga */
  --color-accent: #A61C1C;        /* Glavna crvena (dugmad, badge) */
  --color-accent-hover: #C42222;  /* Hover stanje */
  --color-cream: #0e0a0b;         /* Pozadina (tamna) */
  --color-charcoal: #221720;      /* Povrsine (tamno ljubicasta) */
  --color-text-dark: #f0e6e4;     /* Glavni tekst (svetao) */
  --color-text-muted: #b09890;    /* Sekundarni tekst */
  --font-heading: "Playfair Display", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
}
```

### Primeri Tailwind klasa iz projekta:

**Responsive dizajn (mobile-first):**
```tsx
<div className="text-sm sm:text-base lg:text-lg">
  {/* text-sm na mobilnom, text-base na >=640px, text-lg na >=1024px */}
</div>

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* 1 kolona na mobilnom, 2 na tabletu, 4 na desktopu */}
</div>
```

**Layout:**
```tsx
<div className="flex items-center justify-between gap-3">
  {/* Flexbox: poravnaj vertikalno po centru, razmakni horizontalno, gap 12px */}
</div>

<div className="mx-auto max-w-3xl px-4 sm:px-6">
  {/* Centriraj, maks sirina 768px, padding 16px (mobilno) / 24px (tablet+) */}
</div>
```

**Tipografija:**
```tsx
<h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light">
  {/* Custom font za naslove, 30px, bold, svetla boja */}
</h1>

<p className="text-sm text-text-muted line-clamp-2">
  {/* 14px, siva boja, maksimum 2 linije (ostalo se secepka...) */}
</p>
```

**Interaktivnost:**
```tsx
<button className="rounded-lg bg-accent px-3 py-2 text-white transition-all hover:bg-accent-hover active:scale-95">
  {/* Zaobljen, crvena pozadina, beo tekst, na hover svetlija crvena, na klik smanji */}
</button>
```

**Pozicioniranje:**
```tsx
<div className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-md">
  {/* Sticky header: ostaje na vrhu, z-index 50, 95% opacity, blur pozadine */}
</div>

<div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
  {/* Fixed floating dugme: dole 24px, centrirano horizontalno */}
</div>
```

**Skrivanje/prikazivanje:**
```tsx
<nav className="hidden md:flex">
  {/* Skriveno na mobilnom, flex na tabletu+ (desktop navigacija) */}
</nav>

<button className="md:hidden">
  {/* Prikazano samo na mobilnom (hamburger meni dugme) */}
</button>

<span className="hidden sm:inline">Dodaj</span>
  {/* Tekst dugmeta sakriven na mobilnom, prikazan na tabletu+ */}
```

### Custom Tailwind klase iz projekta:
Ove klase su definisane u `globals.css` i mogu se koristiti pored Tailwind utility klasa:

| Klasa | Sta radi |
|-------|----------|
| `glass-card` | Glassmorphism efekat: poluprozirna pozadina + blur + suptilna senka + hover lift |
| `glass-card-flat` | Isto kao gore ali bez hover lift efekta |
| `shimmer-btn` | Svetlucavi efekat na dugmadima (animiran sjaj) |
| `text-glow` | Crveni glow efekat na tekstu (hero naslovi) |
| `fire-glow` | Pulsirajtii crveni box-shadow (logo, CTA) |
| `smoke-overlay` | Radijalni gradijent koji simulira dim/vatru |
| `gradient-border-top` | Dekorativna crvena linija na vrhu sekcije |
| `gradient-border-bottom` | Dekorativna crvena linija na dnu sekcije |
| `header-glow` | Crvena linija na dnu headera |
| `nav-link` | Animirani podvlacenje na hover |
| `input-premium` | Stilizovan input sa glow focus efektom |
| `badge-pulse` | Pulsirajuci badge na ikoni korpe |
| `noise-overlay` | Suptilna SVG tekstura na celoj stranici (0.015 opacity) |
| `animate-ken-burns` | Polako zumira sliku (hero pozadina) |
| `gallery-img-hover` | Crveni overlay na hover slike u galeriji |
| `section-divider` | Dekorativne linije sa obe strane naslova sekcije |

---

## 6. Framer Motion — Animacije

### Sta je Framer Motion?
React biblioteka za animacije. Umesto rucnog CSS-a, deklarises pocetno i krajnje stanje, a Motion animira prelaz.

### Gde se koristi u projektu:

**Pocetna stranica — Staggered entrance (postupni ulazak):**
```tsx
<motion.h1
  initial={{ opacity: 0, y: 30 }}       // Pocetno stanje: nevidljiv, 30px ispod
  animate={{ opacity: 1, y: 0 }}         // Krajnje stanje: vidljiv, na mestu
  transition={{ duration: 0.6, delay: 0.05 }}  // 0.6s, pocetak posle 0.05s
>
  {t("heroTitle")}
</motion.h1>
```
Svaki element hero sekcije ima malo veci `delay` — tako nastaje "staggered" efekat gde elementi ulaze jedan za drugim.

**Reduced motion podrska:**
```tsx
const prefersReduced = useReducedMotion();
// Ako je korisnik u OS podesavanjima ukljucio "Reduce motion":
initial={prefersReduced ? false : { opacity: 0, y: 30 }}
// false = preskoci animaciju (pristupacnost)
```

**CartButton — Floating ulaz/izlaz:**
```tsx
<AnimatePresence>
  <motion.div
    initial={{ y: 100, opacity: 0 }}   // Pocetno: ispod ekrana
    animate={{ y: 0, opacity: 1 }}      // Animira na mesto
    exit={{ y: 100, opacity: 0 }}       // Izlaz: opet ispod ekrana
  >
    {/* Floating dugme za korpu */}
  </motion.div>
</AnimatePresence>
```
`AnimatePresence` omogucava exit animaciju — animacija kad se element UKLANJA sa stranice.

**CartPage — Layout animacija:**
```tsx
<motion.div layout>  {/* Automatski animira promenu pozicije */}
  {/* Stavka u korpi */}
</motion.div>
```
Kad se stavka ukloni, ostale automatski klize na mesto (umesto naglog skoka).

---

## 7. Zustand — Upravljanje stanjem (State Management)

### Sta je Zustand?
Zustand je minimalisticki state management za React. Zamenjuje React Context/Redux za globalno stanje.

### Zasto Zustand a ne Redux?
- 10x manje koda (nema actions, reducers, dispatchers)
- Radi sa localStorage iz kutije (`persist` middleware)
- Tip-bezbedan sa TypeScript-om
- Nema Provider wrapper-a

### Kako radi korpa — `src/lib/cart-store.ts`:

```typescript
export const useCartStore = create<CartStore>()(
  persist(                           // persist = cuva u localStorage
    (set, get) => ({
      items: [],                     // Niz stavki u korpi

      addItem: (item, quantity = 1) => {
        set((state) => {
          // Proveri da li stavka vec postoji u korpi
          const existing = state.items.find(i => getItemKey(i.id, i.size) === key);
          if (existing) {
            // Ako postoji → povecaj kolicinu
            return { items: state.items.map(i => ...) };
          }
          // Ako ne postoji → dodaj novu stavku
          return { items: [...state.items, { ...item, quantity }] };
        });
      },

      removeItem: (id, size) => { ... },
      updateQuantity: (id, quantity, size) => { ... },
      clearCart: () => set({ items: [] }),

      // Izvedene vrednosti (computed):
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getComboDiscount: () => { /* logika za popust */ },
      getTotalPrice: () => get().getSubtotal() - get().getComboDiscount(),
    }),
    { name: "mesara-sisko-cart" }   // Kljuc u localStorage
  )
);
```

### Koriscenje u komponetama:
```tsx
// Citanje stanja (sa selektorom — re-renderuje SAMO kad se ta vrednost promeni):
const totalItems = useCartStore((s) => s.getTotalItems());
const items = useCartStore((s) => s.items);

// Akcije:
const addItem = useCartStore((s) => s.addItem);
addItem({ id: "cevapi", name: "Ћевапи", price: 420, ... });

// Destructuring (vise vrednosti odjednom):
const { items, removeItem, clearCart, getTotalPrice } = useCartStore();
```

### Kljuc stavki (`getItemKey`):
```typescript
const getItemKey = (id: string, size?: string) => `${id}-${size || "default"}`;
```
Isti artikal sa razlicitim velicinama (150g vs 200g) su RAZLICITE stavke u korpi.

### Combo popust logika:
```typescript
getComboDiscount: () => {
  const items = get().items;
  for (const combo of combos) {
    // Za svaki combo, proveri da li su SVE potrebne kategorije prisutne u korpi
    const allPresent = requiredCats.every(cat =>
      items.some(i => i.categoryId === cat)
    );
    if (allPresent) {
      // Primeni popust na najjeftiniju stavku u svakoj kategoriji
      discount += cheapest.price * (combo.discount / 100);
    }
  }
  return Math.round(discount);
}
```

### localStorage persistencija:
Zustand `persist` middleware automatski:
1. Cuva celu korpu u `localStorage` pod kljucem `"mesara-sisko-cart"`
2. Pri ucitavanju stranice, cita iz localStorage-a
3. Korpa prezivljava zatvaranje taba/pregledaca

---

## 8. next-intl — Visejezicnost (i18n)

### Sta je next-intl?
Biblioteka za internacionalizaciju (i18n) u Next.js aplikacijama. Omogucava da svaki tekst u aplikaciji bude preveden na vise jezika.

### Arhitektura:

```
src/
├── i18n/
│   ├── routing.ts       ← Definise jezike i lokalizovane URL-ove
│   ├── request.ts       ← Ucitava prevode za server
│   └── navigation.ts    ← Eksportuje Link, useRouter, usePathname
└── messages/
    ├── sr.json          ← Svi srpski prevodi (cirilica)
    └── en.json          ← Svi engleski prevodi
```

### Podrzani jezici:
- **`sr`** (Srpski cirilica) — primarni jezik
- **`en`** (Engleski) — za turiste

### Kako radi routing:

**routing.ts:**
```typescript
export const routing = defineRouting({
  locales: ["sr", "en"],
  defaultLocale: "sr",
  pathnames: {
    "/meni": { sr: "/meni", en: "/menu" },
    "/o-nama": { sr: "/o-nama", en: "/about" },
    "/korpa": { sr: "/korpa", en: "/cart" },
    // ...
  },
});
```
URL-ovi su lokalizovani:
- Srpski: `/sr/meni`, `/sr/korpa`, `/sr/o-nama`
- Engleski: `/en/menu`, `/en/cart`, `/en/about`

### Koriscenje u komponentama:

**Prevodi teksta:**
```tsx
import { useTranslations, useLocale } from "next-intl";

export default function MenuPage() {
  const t = useTranslations("menu");  // Pristup "menu" sekciji prevoda
  const locale = useLocale();          // "sr" ili "en"
  const isEn = locale === "en";

  return (
    <h1>{t("title")}</h1>
    // sr: "Наш мени"
    // en: "Our Menu"
  );
}
```

**Lokalizovani linkovi:**
```tsx
import { Link } from "@/i18n/navigation";  // NE next/link!

<Link href="/meni">Meni</Link>
// Na sr: renderuje <a href="/sr/meni">
// Na en: renderuje <a href="/en/menu">
```

**Promena jezika (LanguageSwitcher):**
```tsx
const router = useRouter();     // iz @/i18n/navigation
const pathname = usePathname(); // Trenutna putanja

const switchLocale = (newLocale: "sr" | "en") => {
  startTransition(() => {
    router.replace(pathname, { locale: newLocale });
    // Menja URL /sr/meni → /en/menu bez full reload
  });
};
```

### Struktura prevoda (sr.json):
```json
{
  "nav": {
    "home": "Почетна",
    "menu": "Мени",
    "cart": "Корпа"
  },
  "menu": {
    "title": "Наш мени",
    "search": "Претражи јела...",
    "addToCart": "Додај"
  },
  "cart": {
    "title": "Ваша корпа",
    "empty": "Корпа је празна",
    "submit": "Пошаљи поруџбину"
  }
}
```
Kljucevi su isti u oba fajla, vrednosti su prevedene.

### Dvojezicni podaci u meniju:
Pored UI prevoda, meni podaci takodje imaju dvojezicne vrednosti:
```typescript
{
  name: "Ћевапи",           // Cirilica
  nameEn: "Ćevapi",          // English
  description: "Традиционални ћевапи у лепињи",
  descriptionEn: "Traditional ćevapi in bread",
}
```
Komponente biraju jezik:
```tsx
const name = isEn ? item.nameEn : item.name;
```

---

## 9. Lucide React — Ikone

### Sta su Lucide ikone?
Open-source SVG ikone. Svaka ikona je React komponenta koja se importuje posebno (tree-shaking — samo ikone koje koristis ulaze u build).

### Ikone koriscene u projektu:

| Ikona | Import | Gde se koristi |
|-------|--------|----------------|
| `Menu` | `lucide-react` | Header — hamburger meni (mobilni) |
| `X` | `lucide-react` | Header — zatvaranje mobilnog menija, MenuSearch — brisanje |
| `ShoppingCart` | `lucide-react` | Header badge, CartButton, CartPage |
| `Plus` | `lucide-react` | MenuItem — dodaj u korpu, CartPage — povecaj kolicinu |
| `Minus` | `lucide-react` | CartPage — smanji kolicinu |
| `Trash2` | `lucide-react` | CartPage — ukloni stavku |
| `ChevronDown` | `lucide-react` | MenuCategory — akordeon strelica, MenuItem — toppings |
| `ChevronUp` | `lucide-react` | MenuItem — toppings zatvoreno |
| `Search` | `lucide-react` | MenuSearch — ikona pretrage |
| `Tag` | `lucide-react` | MenuPage — combo ponude |
| `Flame` | `lucide-react` | HomePage — "Sveze meso" kartica |
| `Leaf` | `lucide-react` | HomePage — "Kvalitet" kartica |
| `Award` | `lucide-react` | HomePage — "Tradicija" kartica |
| `MapPin` | `lucide-react` | Footer, HomePage — lokacija |
| `Clock` | `lucide-react` | Footer, HomePage — radno vreme |
| `Phone` | `lucide-react` | Footer — telefon |
| `Mail` | `lucide-react` | Footer — email |
| `ArrowRight` | `lucide-react` | HomePage — CTA dugmad |
| `ArrowLeft` | `lucide-react` | CartPage — nazad na meni |
| `CheckCircle` | `lucide-react` | CartPage — uspesna porudzbina |
| `CreditCard` | `lucide-react` | CartPage — napomena o placanju |
| `Loader2` | `lucide-react` | CartPage — spinner tokom slanja |

### Primer koriscenja:
```tsx
import { ShoppingCart, Plus } from "lucide-react";

<ShoppingCart size={22} />               // Velicina 22px
<Plus size={16} className="text-white" /> // Sa Tailwind bojom
<Loader2 size={20} className="animate-spin" />  // Sa animacijom
```

---

## 10. Komponente

### 10.1 Header (`src/components/layout/Header.tsx`)

**Svrha:** Navigacija na svim stranicama. Sticky na vrhu.

**Funkcionalnosti:**
- Logo sa linkom na pocetnu
- Desktop navigacija (sakrivena na mobilnom)
- Mobile hamburger meni
- LanguageSwitcher (СР / EN)
- Cart ikona sa badge brojem stavki
- Skip-to-content link za pristupacnost

**Tehnicke napomene:**
- `"use client"` — potreban za useState (mobileOpen) i zustand (totalItems)
- `mounted` state spreccava hydration mismatch (server nema localStorage, browser ima)
- `sticky top-0 z-50` — ostaje na vrhu prilikom skrolovanja
- `backdrop-blur-md` — blur pozadine za poluprozirnost

### 10.2 Footer (`src/components/layout/Footer.tsx`)

**Svrha:** Informacije u podnozju svake stranice.

**Sadrzi:**
- Logo i opis
- Brzi linkovi (navigacija)
- Kontakt informacije (adresa, telefoni, email, radno vreme)
- Copyright

**Koristi `RESTAURANT` konstante** iz `lib/constants.ts` za centralizovane podatke.

### 10.3 LanguageSwitcher (`src/components/layout/LanguageSwitcher.tsx`)

**Svrha:** Prekidac СР / EN za promenu jezika.

**Kako radi:**
1. `useLocale()` — saznaj trenutni jezik
2. `useRouter()` + `usePathname()` — dobij router i putanju
3. `router.replace(pathname, { locale: newLocale })` — zameni locale u URL-u
4. `useTransition()` — obeleaži promenu kao ne-urgentnu (ne blokira UI)

**Dizajn:** Dva pill dugmeta u rounded kontejneru, aktivno je obojeno.

### 10.4 MenuItem (`src/components/menu/MenuItem.tsx`)

**Svrha:** Prikaz jedne stavke u meniju. Najslozenija frontend komponenta.

**Funkcionalnosti:**
- Prikaz slike, imena, opisa, cene
- Izbor velicine (150g / 200g) za stavke u lepinji
- Izbor tezine (0.5kg / 1kg) za stavke na kilo
- Izbor toppings-a (samo za "grill-bread" kategoriju)
- Dodavanje u korpu sa ispravnom cenom

**Logika cene za kg stavke:**
```typescript
const getPrice = () => {
  if (item.options) return item.options[selectedOption].price;
  return item.price || 0;
};
// Prikaz: cena * selectedWeight (npr. 1550 * 0.5 = 775 din za pola kg)
```

**Toppings logika:**
- Prikazuju se samo za `categoryId === "grill-bread"`
- Sezonski toppings (paradajz, krastavac) samo maj-oktobar
- Selektovani toppings se dodaju u ime stavke u korpi

### 10.5 MenuCategory (`src/components/menu/MenuCategory.tsx`)

**Svrha:** Akordeon za jednu kategoriju menija.

**Kako radi:**
- Klik na header otvara/zatvara listu stavki
- `defaultOpen={idx === 0}` — prva kategorija je otvorena po default-u
- Animacija otvaranja: `max-h-[5000px] opacity-100` (otvoreno) vs `max-h-0 overflow-hidden opacity-0` (zatvoreno)
- Chevron ikona se rotira 180 stepeni na otvaranje

### 10.6 MenuSearch (`src/components/menu/MenuSearch.tsx`)

**Svrha:** Input polje za pretragu menija.

**Jednostavna kontrolisana komponenta:**
- `value` i `onChange` dolaze od roditelja (MenuPage)
- X dugme za brisanje pretrage
- Search ikona levo

### 10.7 CartButton (`src/components/menu/CartButton.tsx`)

**Svrha:** Floating dugme na dnu meni stranice koje prikazuje broj stavki i ukupnu cenu.

**Ponasanje:**
- Prikazuje se SAMO kad ima stavki u korpi (`if (totalItems === 0) return null`)
- Animirani ulaz odozdo (Framer Motion)
- Klik vodi na korpu

### 10.8 EmberParticles (`src/components/effects/EmberParticles.tsx`)

**Svrha:** Dekorativni Canvas efekat — cestica vatre/zara na hero sekciji.

**Kako radi:**
1. Kreira HTML Canvas element
2. Generise 18 cestica na dnu
3. Svaka cestica se krece nagore sa nasumicnom brzinom
4. Crtanje: mali crveni krug + veci glow krug
5. Kad cestica "umre" (istekne joj zivot), resetuje se na dno
6. `requestAnimationFrame` za glatku animaciju (60fps)

**Pristupacnost:**
```typescript
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
// Ne pokrece animaciju ako korisnik ima "Reduce motion" ukljuceno
```

**Performance:**
- Deferred: ucitava se tek posle 1.5s (`setTimeout`) da ne blokira LCP
- Dynamic import: `const EmberParticles = dynamic(() => import(...), { ssr: false })`
- `aria-hidden="true"` — screen readeri ignorisu canvas

---

## 11. Stranice

### 11.1 Pocetna (`src/app/[locale]/page.tsx`)

**Sekcije:**
1. **Cinematic Hero** — 5 layer-a (pozadina + gradijent + dim + cestica + tekst)
2. **Why Us** — 3 kartice (Sveze meso, Tradicija, Kvalitet)
3. **Popular Items** — 4 popularne stavke iz menija
4. **Find Us** — Adresa + radno vreme + link na mapu

**Hero layer sistem:**
```
Layer 1: Background image (Ken Burns zoom animacija, opacity 40%)
Layer 2: Gradient overlay (from-cream via-charcoal to-charcoal)
Layer 3: Smoke overlay (radijalni gradijenti, pulsirajuca animacija)
Layer 4: Ember particles (Canvas, deferred 1.5s)
Layer 5: Content (logo, naslov, podnaslov, dugmad — staggered entrance)
Layer 6: Bottom fade (gradijent u pozadinu)
```

### 11.2 Meni (`src/app/[locale]/meni/page.tsx`)

**Funkcionalnosti:**
1. Search bar sa Latin-to-Cyrillic konverzijom
2. Quick nav dugmad za skrolovanje do kategorije
3. Combo ponude sekcija
4. 6 kategorija u akordeonima
5. Floating CartButton

**Latin-to-Cyrillic pretraga:**
```typescript
function latinToCyrillic(text: string): string {
  const map = [["lj","љ"], ["nj","њ"], ["dž","џ"], ...];
  let result = text.toLowerCase();
  for (const [lat, cyr] of map) {
    result = result.replaceAll(lat, cyr);
  }
  return result;
}
// Korisnik kuca "cevapi" → konvertuje u "цевапи" → pronalazi "Ћевапи"
```

### 11.3 Korpa (`src/app/[locale]/korpa/page.tsx`)

**Stanja stranice:**
1. **Prazna korpa** → Ikona + poruka + link na meni
2. **Sa stavkama** → Lista + total + forma + submit
3. **Uspesna porudzbina** → Animirana potvrda + redirect na `/porudzbina/[id]`

**Tok slanja porudzbine:**
```
1. Korisnik popuni ime, telefon, napomenu
2. Klik "Posalji"
3. fetch("/api/order", { method: "POST", body: JSON.stringify({...}) })
4. Ako API vrati orderId → redirect na /porudzbina/[orderId]
5. clearCart() → isprazni korpu
6. Ako API ne radi → prikazhi staticnu poruku uspeha (graceful fallback)
```

**Quantity kontrole:**
- Za decimalne kolicine (kg): korak od 0.25 (0.5 → 0.75 → 1.0)
- Za cele kolicine: korak od 1
- Ako kolicina padne na 0 ili manje → stavka se uklanja

---

## 12. CSS sistem

### Paleta boja (Dark mode):

| Varijabla | Hex | Upotreba |
|-----------|-----|----------|
| `--color-accent` | `#A61C1C` | Glavna crvena — dugmad, linkovi, badge, cene |
| `--color-accent-hover` | `#C42222` | Hover stanje dugmadi |
| `--color-primary` | `#8a2029` | Tamnija crvena — aktivni tab u LanguageSwitcher |
| `--color-secondary` | `#c75a2a` | Narandzasta — dekorativni akcenat |
| `--color-cream` | `#0e0a0b` | Osnovna pozadina (skoro crna) |
| `--color-cream-dark` | `#1a1315` | Tamnije povrsine (kartice, inputi) |
| `--color-charcoal` | `#221720` | Header, footer, sekcije |
| `--color-charcoal-light` | `#2e2128` | Okviri, hover stanja |
| `--color-text-dark` | `#f0e6e4` | Primarni tekst (svetao) |
| `--color-text-light` | `#fdf5f3` | Hero tekst (najsvetliji) |
| `--color-text-muted` | `#b09890` | Sekundarni tekst, opisi |
| `--color-wood-light` | `#d9b09a` | Dekorativna boja (naslovi footer-a) |
| `--color-ember` | `#d1461e` | Boja cestica vatre |

### Fontovi:
- **Playfair Display** (serif) — Naslovi (h1–h6). Elegantan, tradicionalan.
- **Inter** (sans-serif) — Tekst, dugmad, inputi. Citak, moderan.

### Animacije:

| Animacija | Trajanje | Efekat |
|-----------|----------|--------|
| Ken Burns | 20s | Polako zumira hero sliku |
| Ember Pulse | 4s | Pulsira opacity dim overlaya |
| Fire Glow | 2s | Pulsira box-shadow loga |
| Shimmer | 3s | Svetlucavi sjaj na dugmadima |
| Badge Pulse | 2s | Pulsira velicinu badge-a na korpi |
| Nav underline | 0.3s | Animira podvlacenje linka |

---

## 13. Podaci (Data sloj)

### 13.1 menu.ts — Podaci o meniju

6 kategorija sa ukupno 50+ stavki:

| Kategorija | ID | Stavke | Cena format |
|------------|----|--------|-------------|
| Rostilj na kilo | `grill-kg` | 13 | cena/kg + izbor tezine |
| Rostilj u lepinji | `grill-bread` | 11 | opcije velicine (150g/200g) + toppings |
| Riba | `fish` | 1 | cena/kg |
| Dodaci i lepinje | `sides-bread` | 8 | fiksna cena |
| Salate i dodaci | `salads` | 8 | fiksna cena |
| Pice | `drinks` | 12 | fiksna cena |

### 13.2 combos.ts — Combo ponude
3 kombinacije sa 10% popustom:
- Rostilj u lepinji + Pice (-10%)
- Rostilj na kilo + Pice (-10%)
- Komplet lepinja + Jogurt (bez popusta — samo prikaz)

### 13.3 toppings.ts — Dodaci za lepinju
12 toppinga: kupus, pavlaka, luk, urnebes, tucana paprika, senf, majonez, kecap, vegeta, pretop + sezonski (paradajz, krastavac — samo maj-oktobar).

---

## 14. Konfiguracioni fajlovi

| Fajl | Svrha |
|------|-------|
| `next.config.ts` | Next.js konfiguracija + next-intl plugin |
| `tsconfig.json` | TypeScript konfiguracija, `@/` → `./src/` alias |
| `package.json` | Zavisnosti, skripte (dev, build, lint) |
| `postcss.config.mjs` | PostCSS konfiguracija za Tailwind |
| `Dockerfile` | Multi-stage Docker build (Node 22 Alpine) |
| `docker-compose.yml` | Docker servis na portu 4200 |
| `.env.example` | Primer env varijabli |
| `.gitignore` | Fajlovi koje git ignorise |

---

## 15. Obrasci dizajna korisceni u projektu

### 15.1 Mobile-First Responsive Design
Sve klase su za mobilne uredjaje, `sm:` / `md:` / `lg:` dodaje stilove za vece ekrane.
```
default = mobilni (< 640px)
sm: = tablet (>= 640px)
md: = mali desktop (>= 768px)
lg: = desktop (>= 1024px)
```

### 15.2 Komponentna kompozicija
Velike stranice su podeljene na male, ponovo upotrebljive komponente:
```
MenuPage → MenuSearch + MenuCategory → MenuItem
```

### 15.3 Controlled Components
Svi inputi su "controlled" — React upravlja njihovom vrednoscu:
```tsx
<input value={search} onChange={(e) => setSearch(e.target.value)} />
```

### 15.4 Dynamic Import (Code Splitting)
Teski komponenti se ucitavaju lazno:
```tsx
const EmberParticles = dynamic(() => import("..."), { ssr: false });
```

### 15.5 Hydration Safety
Za komponente koje koriste browser-only API-je (localStorage):
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
// Prikazi badge SAMO kad je mounted (browser)
{mounted && totalItems > 0 && <badge>...</badge>}
```

### 15.6 Graceful Degradation
Ako API ne radi, korpa ipak prikazuje poruku uspeha:
```tsx
try {
  const res = await fetch("/api/order", ...);
  if (data.orderId) { router.push(...); return; }
} catch {
  // Fallback — staticka poruka
}
setOrderSent(true);
```

### 15.7 Accessibility (Pristupacnost)
- Skip-to-content link u headeru
- `aria-label` na ikonama i dugmadima
- `aria-hidden="true"` na dekorativnim elementima
- `prefers-reduced-motion` podrska
- Semanticki HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
