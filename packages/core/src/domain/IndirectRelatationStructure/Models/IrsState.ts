import { ChunkList } from "../../Ner/Models/ChunkList";
import { EntityList, IrsParams } from "../Models";

export interface IrsState {
  document: ChunkList;
  entities: EntityList;
  params: IrsParams;
}
