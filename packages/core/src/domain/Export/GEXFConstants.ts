import { TokenType } from "../Ner/Models/TokenType";

export enum Attributes {
  WEIGHT = 0,
  TOKEN_TYPE = 1,
  RELATIONS_COUNT = 2,
  NEIGHBOURS_COUNT = 3,
}

export const TokenTypes = [
  { value: TokenType.DATE, label: "Data" },
  { value: TokenType.ORGANIZATION, label: "Organizacja" },
  { value: TokenType.LOCATION, label: "Lokalizacja" },
  { value: TokenType.PLACE, label: "Miejsce" },
  { value: TokenType.PERSON, label: "Osoba" },
  { value: TokenType.NUMBER, label: "Liczba" },
  { value: TokenType.NORP, label: "Narodowość" },
  { value: TokenType.ART, label: "Dzieło sztuki" },
  { value: TokenType.MISCELLANEOUS, label: "Pozostałe" },
];
