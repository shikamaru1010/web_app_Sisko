export type Topping = {
  id: string;
  name: string;
  nameEn: string;
  seasonal?: "summer"; // only available in summer
};

// Base toppings available year-round (winter + summer)
export const toppings: Topping[] = [
  { id: "kupus", name: "Купус", nameEn: "Cabbage" },
  { id: "pavlaka", name: "Павлака", nameEn: "Sour cream" },
  { id: "luk", name: "Лук", nameEn: "Onion" },
  { id: "urnebes", name: "Урнебес", nameEn: "Urnebes (spicy spread)" },
  { id: "tucana-paprika", name: "Туцана паприка", nameEn: "Crushed pepper" },
  { id: "senf", name: "Сенф", nameEn: "Mustard" },
  { id: "majonez", name: "Мајонез", nameEn: "Mayonnaise" },
  { id: "kecap", name: "Кечап", nameEn: "Ketchup" },
  { id: "vegeta", name: "Вегета", nameEn: "Vegeta seasoning" },
  { id: "pretop", name: "Претоп", nameEn: "Pretop (rendered fat)" },
  // Summer-only toppings
  { id: "paradajz", name: "Парадајз", nameEn: "Tomato", seasonal: "summer" },
  { id: "krastavac", name: "Краставац", nameEn: "Cucumber", seasonal: "summer" },
];

// Helper to get current season toppings
export function getAvailableToppings(): Topping[] {
  const month = new Date().getMonth(); // 0-11
  const isSummer = month >= 4 && month <= 9; // May - October
  if (isSummer) return toppings;
  return toppings.filter((t) => !t.seasonal);
}
