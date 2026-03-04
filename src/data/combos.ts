export type ComboItem = {
  categoryId: string;
  label: string;
  labelEn: string;
};

export type Combo = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  emoji: string;
  items: ComboItem[];
  discount: number; // percentage discount
};

export const combos: Combo[] = [
  {
    id: "combo-grill-bread-drink",
    name: "Роштиљ у лепињи + Пиће",
    nameEn: "Grill in Bread + Drink",
    description: "Изабери омиљени роштиљ у лепињи и освежавајуће пиће по повољнијој цени",
    descriptionEn: "Choose your favorite grill in bread and a refreshing drink at a better price",
    emoji: "sandwich",
    items: [
      { categoryId: "grill-bread", label: "Роштиљ у лепињи", labelEn: "Grill in bread" },
      { categoryId: "drinks", label: "Пиће", labelEn: "Drink" },
    ],
    discount: 10,
  },
  {
    id: "combo-grill-kg-drink",
    name: "Роштиљ на кило + Пиће",
    nameEn: "Grill by Kilo + Drink",
    description: "Свеже месо на кило уз освежење — идеалан комбо за друштво",
    descriptionEn: "Fresh meat by the kilo with a drink — perfect combo for a group",
    emoji: "flame",
    items: [
      { categoryId: "grill-kg", label: "Роштиљ на кило", labelEn: "Grill by kilo" },
      { categoryId: "drinks", label: "Пиће", labelEn: "Drink" },
    ],
    discount: 10,
  },
  {
    id: "combo-komplet-jogurt",
    name: "Комплет лепиња + Јогурт",
    nameEn: "Komplet Lepinja + Yogurt",
    description: "Традиционални доручак — комплет лепиња са домаћим златиборским јогуртом",
    descriptionEn: "Traditional breakfast — komplet lepinja with homemade Zlatibor yogurt",
    emoji: "wheat",
    items: [
      { categoryId: "sides-bread", label: "Комплет лепиња", labelEn: "Komplet lepinja" },
      { categoryId: "sides-bread", label: "Јогурт", labelEn: "Yogurt" },
    ],
    discount: 0, // fixed combo, no percentage
  },
];
