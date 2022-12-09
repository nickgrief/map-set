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
