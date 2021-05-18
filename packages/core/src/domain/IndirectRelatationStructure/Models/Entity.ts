import { TokenType } from "domain/Ner/Models/TokenType";
import { Relation } from "./Relation";

export interface Entity {
  name: string;
  type: TokenType;
  relations: Relation[];
}
