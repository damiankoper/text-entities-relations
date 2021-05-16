import { Language, TextUnit, TokenType } from "core";

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

export const tokenTypes = [
  { value: TokenType.DATE, label: "Data" },
  { value: TokenType.ORGANIZATION, label: "Organizacja" },
  { value: TokenType.LOCATION, label: "Lokalizacja" },
  { value: TokenType.PERSON, label: "Osoba" },
  { value: TokenType.PLACE, label: "Miejsce" }
];

export interface Progress {
  status: "" | "success" | "warning" | "exception";
  percentage: number;
  error: null | string;
  inProgress: boolean;
}
export const defaultProgress: () => Progress = () => ({
  status: "",
  percentage: 0,
  error: null,
  inProgress: false
});

export interface NerParams {
  lang: Language;
}
