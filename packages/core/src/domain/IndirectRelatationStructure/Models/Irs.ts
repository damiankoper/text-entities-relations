import { ChunkList } from "../../Ner/Models/ChunkList";
import { Entity, IrsParams } from ".";

export interface Irs {
  document: ChunkList;
  entities: Entity[];
  params: IrsParams;
}
