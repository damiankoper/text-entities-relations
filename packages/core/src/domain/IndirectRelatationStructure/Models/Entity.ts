import { Relation } from "./Relation";

export interface Entity {
  id: number;
  name: string;
  relations: Relation[];
}
