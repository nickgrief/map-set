# Map, WeakMap, Set, WeakSet conspect

## Map

Map в джаваскрипте это такой тип объекта, хрянящий в себе пары ключ-значение, где каждый ключ уникален. Map запоминает порядок в котором данные были в неё занесены, то есть в порядке добавления уникальных ключей. Похожи на словари в Python и HashMap в Rust.

### Пример использования Map

Допустим, у нас есть два массива контактов. Один массив это данные с сим-карты, а второй это данные с карты памяти телефона. Каждый контакт хранит в себе имя и фамилию человека, его номер телефона и адрес почты. Для некоторых людей есть контакты как на симке, так и на карте телефона и данные в них различаются. Например, на симке для Филипа Пупыришкина записан его номер телефона, а на карте памяти телефона записан адрес его почты. В интерфейсе телефона мы хотим, чтобы все данные контактов с одинаковыми именем и фамилией были объединены.

```ts
interface Contact {
  firstName: string | null;
  secondName: string | null;
  phoneNumbers: string[];
  emails: string[];
}

const simCardData: Contact[] = [
  {
    firstName: "Филип",
    secondName: "Пупырышкин",
    phoneNumbers: ["8 (800) 555-35-35"],
    emails: [],
  },
  {
    firstName: "Мария",
    secondName: "Голубика",
    phoneNumbers: ["8 (765) 432-10-98"],
    emails: ["harleyQueen@flower.net"],
  },
  {
    firstName: "Иннокентий",
    secondName: "Шахматист",
    phoneNumbers: [],
    emails: ["chess_master@learn-chess.com"],
  },
  {
    firstName: "Оля",
    secondName: "Мишко",
    phoneNumbers: ["8 (673) 146-32-73"],
    emails: [],
  },
];

const memoryCardData: Contact[] = [
  {
    firstName: "Филип",
    secondName: "Пупырышкин",
    phoneNumbers: [],
    emails: ["pupirka@free-email.com"],
  },
  {
    firstName: "Виталий",
    secondName: null,
    phoneNumbers: ["8 (333) 234-54-11"],
    emails: [],
  },
  {
    firstName: "Оля",
    secondName: "Мишко",
    phoneNumbers: ["8 (673) 146-32-73"],
    emails: [],
  },
  {
    firstName: "Мария",
    secondName: "Голубика",
    phoneNumbers: ["8 (456) 112-32-15"],
    emails: ["harleyQueen@flower.net"],
  },
];

function combineContact(contact: Contact) {
  if (!contact.firstName && !contact.secondName) {
    return;
  }

  const fullName = (
    (contact.firstName ? contact.firstName : "") +
    " " +
    (contact.secondName ? contact.secondName : "")
  ).trim();

  if (!contactsCombined.has(fullName)) {
    contactsCombined.set(fullName, contact);
  } else {
    const combinedData = contactsCombined.get(fullName)!;
    combinedData.phoneNumbers.push(
      ...contact.phoneNumbers.filter(
        (phoneNumber) => !combinedData.phoneNumbers.includes(phoneNumber)
      )
    );
    combinedData.emails.push(
      ...contact.emails.filter((email) => !combinedData.emails.includes(email))
    );
    contactsCombined.set(fullName, combinedData);
  }
}

const contactsCombined = new Map<string, Contact>();

simCardData.forEach(combineContact);
memoryCardData.forEach(combineContact);

console.log(contactsCombined);
```

Вывод:

```bash
nick@nick ~/Documents/angular/map-set 
$ deno run contacts.ts
Map {
  "Филип Пупырышкин" => {
      firstName: "Филип",
      secondName: "Пупырышкин",
      phoneNumbers: [ "8 (800) 555-35-35" ],
      emails: [ "pupirka@free-email.com" ]
    },
  "Мария Голубика" => {
      firstName: "Мария",
      secondName: "Голубика",
      phoneNumbers: [ "8 (765) 432-10-98", "8 (456) 112-32-15" ],
      emails: [ "harleyQueen@flower.net" ]
    },
  "Иннокентий Шахматист" => {
      firstName: "Иннокентий",
      secondName: "Шахматист",
      phoneNumbers: [],
      emails: [ "chess_master@learn-chess.com" ]
    },
  "Оля Мишко" => {
      firstName: "Оля",
      secondName: "Мишко",
      phoneNumbers: [ "8 (673) 146-32-73" ],
      emails: []
    },
  "Виталий" => {
      firstName: "Виталий",
      secondName: null,
      phoneNumbers: [ "8 (333) 234-54-11" ],
      emails: []
    }
}
```

## WeakMap

WeakMap это тип объекта в джаваскрипте, позволяющий хранить пары ключа и значения, где ключ может быть только типа Object и не предотврящающий сброщик мусора от отчистки ключа.

Простыми словами, если в обыкновенном Map мы запишем в ключ объект testObject, то, даже если мы удалим этот объект, в Map останется этот объект в роли ключа. В WeakMap такого не произойдет. WeakMap хранит "слабые" ссылки на свои ключи, что дает возможность их отчистке, если объекты-ключи были удалены.

```ts
const weakMap = new WeakMap();
const map = new Map();

let testObject: { value: string } | null = {
  value: "some value",
};

weakMap.set(testObject, "I'm in a WeakMap");
map.set(testObject, "I'm in a Map");

testObject = null;

/*
map - сохранит у себя ссылку на testObject,
не позволяя ему быть очищенным из памяти сборщиком мусора
weakMap - не сохраняет у себя "сильную" ссылку на testObject,
тем самым позволит ему быть очищенным из памяти сборщиком мусора
*/
```

### Пример использования WeakMap

WeakMap используется для решения различных задач, например: кеширование, хранение метаданных и энкапсуляция.

Я покажу простенький и надуманный пример хранения метаданных для объектов.

Допустим, у нас есть мультиплеерная игра в которой идут долгие бои за территории. Игроки могут подключаться к и отключаться от матча пока он идет. Мы хотим показывать им их статистику за сессию игры, но не хотим хранить эту информацию, если они выйдут. Для этого подойдет WeakMap.

```ts
interface Server {
  name: string;
  maxPlayers: number;
  currentPlayers: Player[];
}

class Player {
  name: string;
  playerClass: "Warrior" | "Mage" | "Archer";
  team: "Orks" | "Humans" | "Aliens";
  server: Server | null;
  session: Session | null;

  constructor(
    name: string,
    playerClass: "Warrior" | "Mage" | "Archer",
    team: "Orks" | "Humans" | "Aliens"
  ) {
    this.name = name;
    this.playerClass = playerClass;
    this.team = team;
    this.server = null;
    this.session = null;
  }

  connect = (server: Server, session: Session) => {
    this.server = server;
    this.session = session;
    server.currentPlayers.push(this);
    this.session.set(this, <Stats>{
      kills: 0,
      deaths: 0,
    });
    console.log(
      `Player: ${this.name} has connected to the server ${server.name}.`
    );
  };

  disconnect = () => {
    const index = server.currentPlayers.findIndex((player) => player === this);
    server.currentPlayers.splice(index);
    this.server = null;
    this.session = null;
    console.log(
      `Player: ${this.name} has disconnected from the server ${server.name}.`
    );
  };

  die = () => {
    if (this.session) {
      const prev = this.session.get(this);
      if (prev) {
        this.session.set(this, <Stats>{
          kills: prev.kills,
          deaths: prev.deaths + 1,
        });
      }
    }
    console.log(`Player: ${this.name} has died.`);
  };

  kill = (targetPlayer: Player) => {
    if (this.session) {
      const prev = this.session.get(this);
      if (prev) {
        this.session.set(this, <Stats>{
          kills: prev.kills + 1,
          deaths: prev.deaths,
        });
      }
    }
    console.log(`Player: ${this.name} has killed player ${targetPlayer.name}.`);
    targetPlayer.die();
  };

  say = (message: string) => {
    console.log(`${this.name}: ${message}`);
  };

  showOff = () => {
    console.log(
      `Player ${this.name}'s stats:\nKills: ${
        this.session?.get(this)?.kills
      }\nDeaths: ${this.session?.get(this)?.deaths}`
    );
  };
}

interface Stats {
  kills: number;
  deaths: number;
}

type Session = WeakMap<Player, Stats>;

const server: Server = {
  name: "Evergaol",
  maxPlayers: 255,
  currentPlayers: [],
};

const sessions = new WeakMap<Player, Stats>();

const playerOne = new Player("Alugrath", "Mage", "Humans");
playerOne.connect(server, sessions);

let playerTwo = new Player("Magasa", "Archer", "Aliens");
playerTwo.connect(server, sessions);

playerOne.kill(playerTwo);
playerOne.kill(playerTwo);
playerTwo.kill(playerOne);
playerOne.kill(playerTwo);

playerOne.showOff();
playerOne.say("What's up?");

playerTwo.disconnect();

playerOne.say("Ha-ha-ha");

playerTwo = new Player("John", "Warrior", "Humans");
playerTwo.connect(server, sessions);

playerTwo.say("Hey, I'm his brother...");

playerTwo.kill(playerOne);
playerTwo.kill(playerOne);
playerTwo.kill(playerOne);
playerTwo.kill(playerOne);

playerTwo.showOff();

playerOne.say("I'm sorry.");

playerOne.disconnect();

playerTwo.disconnect();
```

```text
nick@nick ~/Documents/angular/map-set 
❯ deno run multiplayer.ts
Player: Alugrath has connected to the server Evergaol.
Player: Magasa has connected to the server Evergaol.
Player: Alugrath has killed player Magasa.
Player: Magasa has died.
Player: Alugrath has killed player Magasa.
Player: Magasa has died.
Player: Magasa has killed player Alugrath.
Player: Alugrath has died.
Player: Alugrath has killed player Magasa.
Player: Magasa has died.
Player Alugrath's stats:
Kills: 3
Deaths: 1
Alugrath: What's up?
Player: Magasa has disconnected from the server Evergaol.
Alugrath: Ha-ha-ha
Player: John has connected to the server Evergaol.
John: Hey, I'm his brother...
Player: John has killed player Alugrath.
Player: Alugrath has died.
Player: John has killed player Alugrath.
Player: Alugrath has died.
Player: John has killed player Alugrath.
Player: Alugrath has died.
Player: John has killed player Alugrath.
Player: Alugrath has died.
Player John's stats:
Kills: 4
Deaths: 0
Alugrath: I'm sorry.
Player: Alugrath has disconnected from the server Evergaol.
Player: John has disconnected from the server Evergaol.
```

Сложно продемонстрировать работу WeakMap, так как мы не можем обратиться к ключу объекта, отчищенному сборщиком мусора.

Вместо этого я разыграл сценку :)

## Set

Set это объект в джаваскрипте, позволяющий хранить уникальные значения любого типа. Может быть использован непосредственно для получения набора уникальных значений из итерируемых объектов.

### Пример использования Set

Например, мы можем найти количество уникальных слов в стихе библии:

```ts
const jsonResponse: Response = await fetch("https://bible-api.com/john 5:16");
const jsonData = await jsonResponse.json();

const verse = jsonData.text as string;

console.log(`Verse:\n${verse}`);

const verseWithoutPunctuation = verse.trim().replaceAll(/[.,!\?\n]/g, "");

const words = verseWithoutPunctuation.split(" ");

const wordCount = words.length;

const uniqueWords = [...new Set(words)];

const uniqueWordsCount = uniqueWords.length;

console.log(`Unique words: ${uniqueWords}\n`);
console.log(
  `Before ${wordCount} words.\nAfter: ${uniqueWordsCount} words.\nDifference: ${
    wordCount - uniqueWordsCount
  }.`
);
```

Вывод:

```text
nick@nick ~/Documents/angular/map-set 
❯ deno run --allow-net bible-words.ts
Verse:
For this cause the Jews persecuted Jesus, and sought to kill him, because he did these things on the Sabbath.

Unique words: For,this,cause,the,Jews,persecuted,Jesus,and,sought,to,kill,him,because,he,did,these,things,on,Sabbath

Before 20 words.
After: 19 words.
Difference: 1.
```

## WeakSet

WeakSet для Set это тоже самое, что и WeakMap для Map. Хранит слабые ссылки на уникальные объекты. Используется, например, для защиты от бесконечных рекурсий в рекурсивных функциях. Так как хранит слабые ссылки, то не занимает много памяти и работает быстрее обычного сета.

### Пример использования WeakSet

Используя WeakSet мы можем "тэгать" объекты, добавляя их в WeakSet для того, чтобы, например, показать, что мы их уже обработали и т.д.

Качественный и ёмкий пример для подходящей для этого ситуации привести сложно, так как польза от такой методики явно видна только в более комплексных системах, чем то, что я тут могу накалякать.
