export type KidsQuizQuestion = {
  question: string;
  questionEn: string;
  options: string[];
  optionsEn: string[];
  correct: number;
  emoji: string;
};

export const kidsQuizQuestions: KidsQuizQuestion[] = [
  {
    question: "Од чега се прави хлеб?",
    questionEn: "What is bread made from?",
    options: ["Брашно", "Шећер", "Со", "Вода"],
    optionsEn: ["Flour", "Sugar", "Salt", "Water"],
    correct: 0,
    emoji: "\u{1F35E}",
  },
  {
    question: "Која животиња нам даје млеко?",
    questionEn: "Which animal gives us milk?",
    options: ["Мачка", "Крава", "Пас", "Зец"],
    optionsEn: ["Cat", "Cow", "Dog", "Rabbit"],
    correct: 1,
    emoji: "\u{1F404}",
  },
  {
    question: "Које воће је црвено и расте на дрвету?",
    questionEn: "Which fruit is red and grows on a tree?",
    options: ["Банана", "Јабука", "Грожђе", "Лимун"],
    optionsEn: ["Banana", "Apple", "Grape", "Lemon"],
    correct: 1,
    emoji: "\u{1F34E}",
  },
  {
    question: "Шта пијемо уз роштиљ?",
    questionEn: "What do we drink with grilled food?",
    options: ["Сок", "Боју", "Шампон", "Лепак"],
    optionsEn: ["Juice", "Paint", "Shampoo", "Glue"],
    correct: 0,
    emoji: "\u{1F964}",
  },
  {
    question: "Шта је помфрит?",
    questionEn: "What are french fries made from?",
    options: ["Кромпир", "Морква", "Јабука", "Парадајз"],
    optionsEn: ["Potato", "Carrot", "Apple", "Tomato"],
    correct: 0,
    emoji: "\u{1F35F}",
  },
  {
    question: "На чему печемо роштиљ?",
    questionEn: "What do we grill on?",
    options: ["На леду", "На ватри", "На води", "На ветру"],
    optionsEn: ["On ice", "On fire", "On water", "On wind"],
    correct: 1,
    emoji: "\u{1F525}",
  },
  {
    question: "Шта једемо за доручак?",
    questionEn: "What do we eat for breakfast?",
    options: ["Камење", "Јаја", "Песак", "Лишће"],
    optionsEn: ["Rocks", "Eggs", "Sand", "Leaves"],
    correct: 1,
    emoji: "\u{1F373}",
  },
  {
    question: "Где се налази Златибор?",
    questionEn: "Where is Zlatibor located?",
    options: ["У мору", "На планини", "У пустињи", "На месецу"],
    optionsEn: ["In the sea", "On a mountain", "In the desert", "On the moon"],
    correct: 1,
    emoji: "\u{1F3D4}\u{FE0F}",
  },
  {
    question: "Које поврће је наранџасто и расте у земљи?",
    questionEn: "Which vegetable is orange and grows in the ground?",
    options: ["Краставац", "Шаргарепа", "Парадајз", "Паприка"],
    optionsEn: ["Cucumber", "Carrot", "Tomato", "Pepper"],
    correct: 1,
    emoji: "\u{1F955}",
  },
  {
    question: "Од чега правимо ћевапе?",
    questionEn: "What do we make cevapi from?",
    options: ["Од воћа", "Од меса", "Од чоколаде", "Од песка"],
    optionsEn: ["From fruit", "From meat", "From chocolate", "From sand"],
    correct: 1,
    emoji: "\u{1F356}",
  },
  {
    question: "Која је најдужа река у Србији?",
    questionEn: "What is the longest river in Serbia?",
    options: ["Сава", "Дунав", "Морава", "Дрина"],
    optionsEn: ["Sava", "Danube", "Morava", "Drina"],
    correct: 1,
    emoji: "\u{1F3DE}\u{FE0F}",
  },
  {
    question: "Колико боја има дуга?",
    questionEn: "How many colors does a rainbow have?",
    options: ["3", "5", "7", "10"],
    optionsEn: ["3", "5", "7", "10"],
    correct: 2,
    emoji: "\u{1F308}",
  },
];
