import { Position } from "./Position";
import { Entity } from "./Entity";

export interface Relation extends Position {
  target: Entity;
}
