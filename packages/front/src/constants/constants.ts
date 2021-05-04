import { Language } from "core";

export enum TextUnit {
  WORD = "word",
  SENTENCE = "sentence",
  CHUNK = "chunk"
}

export const languages = [
  { value: Language.PL, label: "Polski" },
  { value: Language.EN, label: "Angielski" },
  { value: Language.DE, label: "Niemiecki" },
  { value: Language.ES, label: "Hiszpański" },
  { value: Language.RU, label: "Rosyjski" }
];

export const units = [
  { value: TextUnit.CHUNK, label: "Paragraf" },
  { value: TextUnit.SENTENCE, label: "Zdanie" },
  { value: TextUnit.WORD, label: "Słowo" }
];

export const sliderUnits = [
  { value: TextUnit.CHUNK, label: "Paragraf" },
  { value: TextUnit.SENTENCE, label: "Zdanie" },
  { value: TextUnit.WORD, label: "Słowo" }
];
