export type QuizQuestion = {
  question: string;
  questionEn: string;
  options: string[];
  optionsEn: string[];
  correct: number;
};

export const adultQuizQuestions: QuizQuestion[] = [
  {
    question: "Који је најпопуларнији месни производ на роштиљу у Србији?",
    questionEn: "What is the most popular grilled meat product in Serbia?",
    options: ["Ћевапи", "Виршле", "Шницла", "Гулаш"],
    optionsEn: ["Ćevapi", "Sausages", "Schnitzel", "Goulash"],
    correct: 0,
  },
  {
    question: "На којој планини се налази Чајетина?",
    questionEn: "On which mountain is Čajetina located?",
    options: ["Копаоник", "Златибор", "Тара", "Дивчибаре"],
    optionsEn: ["Kopaonik", "Zlatibor", "Tara", "Divčibare"],
    correct: 1,
  },
  {
    question: "Шта је кајмак?",
    questionEn: "What is kajmak?",
    options: [
      "Врста сира",
      "Млечни намаз од павлаке",
      "Путер",
      "Јогурт",
    ],
    optionsEn: [
      "A type of cheese",
      "A cream-based dairy spread",
      "Butter",
      "Yogurt",
    ],
    correct: 1,
  },
  {
    question: "Колико степени Целзијуса је идеална температура роштиља за месо?",
    questionEn: "What is the ideal grill temperature for meat in Celsius?",
    options: ["100-150°C", "150-200°C", "200-250°C", "300-350°C"],
    optionsEn: ["100-150°C", "150-200°C", "200-250°C", "300-350°C"],
    correct: 2,
  },
  {
    question: "Од ког меса се праве традиционални ћевапи?",
    questionEn: "What meat are traditional ćevapi made from?",
    options: [
      "Само свињско",
      "Само пилеће",
      "Мешавина јунећег и свињског",
      "Јагнеће",
    ],
    optionsEn: [
      "Only pork",
      "Only chicken",
      "A mix of beef and pork",
      "Lamb",
    ],
    correct: 2,
  },
  {
    question: "Шта је 'претоп' у српској кухињи?",
    questionEn: "What is 'pretop' in Serbian cuisine?",
    options: [
      "Зачин",
      "Растопљена маст са луком",
      "Сос од парадајза",
      "Маринада",
    ],
    optionsEn: [
      "A spice",
      "Rendered fat with onions",
      "Tomato sauce",
      "Marinade",
    ],
    correct: 1,
  },
  {
    question: "Која река протиче кроз Чајетину?",
    questionEn: "Which river flows through Čajetina?",
    options: ["Дрина", "Ђетиња", "Морава", "Колубара"],
    optionsEn: ["Drina", "Đetinja", "Morava", "Kolubara"],
    correct: 1,
  },
  {
    question: "Колико порција ћевапа обично иде у једну лепињу?",
    questionEn: "How many ćevapi usually go in one flatbread?",
    options: ["3-5", "5-10", "10-15", "15-20"],
    optionsEn: ["3-5", "5-10", "10-15", "15-20"],
    correct: 1,
  },
  {
    question: "Шта је 'комплет лепиња'?",
    questionEn: "What is 'komplet lepinja'?",
    options: [
      "Лепиња са свиме",
      "Лепиња са јајима и кајмаком",
      "Лепиња од кукурузног брашна",
      "Лепиња пуњена месом",
    ],
    optionsEn: [
      "Flatbread with everything",
      "Flatbread with eggs and kajmak",
      "Cornmeal flatbread",
      "Flatbread stuffed with meat",
    ],
    correct: 1,
  },
  {
    question: "Који је симбол Златибора?",
    questionEn: "What is the symbol of Zlatibor?",
    options: [
      "Медвед",
      "Златиборски бор",
      "Орао",
      "Јелен",
    ],
    optionsEn: [
      "Bear",
      "Zlatibor pine tree",
      "Eagle",
      "Deer",
    ],
    correct: 1,
  },
  {
    question: "Која је надморска висина Златибора?",
    questionEn: "What is the altitude of Zlatibor?",
    options: ["500m", "800m", "1000m", "1500m"],
    optionsEn: ["500m", "800m", "1000m", "1500m"],
    correct: 2,
  },
  {
    question: "Шта значи 'б.к.' у описима меса?",
    questionEn: "What does 'b.k.' mean in meat descriptions?",
    options: [
      "Без коже",
      "Без кости",
      "Бели комад",
      "Брзо кувано",
    ],
    optionsEn: [
      "Skinless",
      "Boneless",
      "White cut",
      "Quick cooked",
    ],
    correct: 1,
  },
];
