const weakMap = new WeakMap();
const map = new Map();

let testObject: { value: string } | null = {
  value: "some value",
};

weakMap.set(testObject, "I'm in a WeakMap");
map.set(testObject, "I'm in a Map");

testObject = null;

// map - сохранит у себя ссылку на testObject не позволяя ему быть очищенным из памяти сборщиком мусора
// weakMap - не сохраняет у себя "сильную" ссылку на testObject, тем самым позволит ему быть очищенным из памяти сборщиком мусора
