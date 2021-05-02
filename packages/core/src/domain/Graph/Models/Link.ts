import { SimulationLinkDatum } from "d3";
import { Node } from "./Node";

export interface Link extends SimulationLinkDatum<Node> {
  id?: number;
  strength?: number;
}
