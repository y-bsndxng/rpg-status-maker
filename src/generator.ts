import { elements, jobs, names, skills } from "./data";
import type { CharacterCard, Rarity } from "./types";

function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickManyUnique<T>(items: T[], count: number): T[] {
  const copied = [...items];
  const result: T[] = [];

  while (result.length < count && copied.length > 0) {
    const index = Math.floor(Math.random() * copied.length);
    const [item] = copied.splice(index, 1);
    result.push(item);
  }

  return result;
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRarity(): Rarity {
  const roll = Math.random();

  if (roll < 0.5) return "N";
  if (roll < 0.8) return "R";
  if (roll < 0.95) return "SR";
  return "SSR";
}

function rarityBonus(rarity: Rarity): number {
  switch (rarity) {
    case "N":
      return 0;
    case "R":
      return 10;
    case "SR":
      return 22;
    case "SSR":
      return 38;
  }
}

export function generateCharacter(): CharacterCard {
  const rarity = randomRarity();
  const bonus = rarityBonus(rarity);

  return {
    name: pickOne(names),
    job: pickOne(jobs),
    rarity,
    element: pickOne(elements),
    status: {
      hp: randomNumber(30, 75) + bonus,
      mp: randomNumber(10, 70) + bonus,
      attack: randomNumber(10, 65) + bonus,
      defense: randomNumber(10, 65) + bonus,
      speed: randomNumber(10, 65) + bonus,
      intelligence: randomNumber(10, 65) + bonus,
    },
    skills: pickManyUnique(skills, 3).map((skill) => {
      return `${skill} Lv.${randomNumber(1, 10)}`;
    }),
  };
}