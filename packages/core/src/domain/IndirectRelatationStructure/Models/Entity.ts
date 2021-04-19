import { Relation } from "./Relation";

export interface Entity {
  name: string;
  relations: Relation[];
}
