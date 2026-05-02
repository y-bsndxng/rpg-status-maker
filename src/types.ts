export type Rarity = "N" | "R" | "SR" | "SSR";

export type Status = {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  speed: number;
  intelligence: number;
};

export type CharacterCard = {
  name: string;
  job: string;
  rarity: Rarity;
  element: string;
  status: Status;
  skills: string[];
};