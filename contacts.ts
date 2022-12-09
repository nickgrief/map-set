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
