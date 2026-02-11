export const RESTAURANT = {
  name: {
    sr: "Роштиљ месара Шишко",
    en: "Grill Butcher Shop Šiško",
  },
  fullName: {
    sr: "Роштиљ месара Шишко - Чајетина",
    en: "Grill Butcher Shop Šiško - Čajetina",
  },
  address: {
    sr: "Чајетина, Србија",
    en: "Čajetina, Serbia",
  },
  phone: "+381 XX XXX XXXX",
  email: "info@mesara-sisko.rs",
  coordinates: {
    lat: 43.7531,
    lng: 19.7181,
  },
  workingHours: {
    sr: "Понедељак - Недеља: 08:00 - 22:00",
    en: "Monday - Sunday: 08:00 - 22:00",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/meni", labelKey: "nav.menu" },
  { href: "/o-nama", labelKey: "nav.about" },
  { href: "/galerija", labelKey: "nav.gallery" },
  { href: "/kontakt", labelKey: "nav.contact" },
  { href: "/lokacija", labelKey: "nav.location" },
  { href: "/zabava", labelKey: "nav.fun" },
] as const;
