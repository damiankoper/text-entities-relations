import { SimulationLinkDatum } from "d3";
import { Node } from "./Node";

export interface Link extends SimulationLinkDatum<Node> {
  /**
   * Represents, how many times relation between 2 characters occured in given time frame
   */
  strength: number;
  /**
   * Easied value of strength field used for visualization
   */
  easiedStrength: number;
}
