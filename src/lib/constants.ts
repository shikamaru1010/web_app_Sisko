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
    sr: "Краља Александра, Чајетина",
    en: "Kralja Aleksandra, Čajetina",
  },
  phones: ["031 3831068", "064 12 14 024"],
  email: "info@mesara-sisko.rs",
  coordinates: {
    lat: 43.7508477,
    lng: 19.718105,
  },
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2882.060150852891!2d19.715530076007653!3d43.7508476710976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47582faf891a033d%3A0xc1e0eba3e7c48d62!2zUm_FoXRpbGogxaBpxaFrbw!5e0!3m2!1ssr!2srs!4v1770846859006!5m2!1ssr!2srs",
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
