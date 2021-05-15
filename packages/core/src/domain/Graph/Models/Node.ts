import { SimulationNodeDatum } from "d3";

export interface Node extends SimulationNodeDatum {
  /**
   * Name of the node displayed on graph. Also identifies nodes.
   */
  id: string;
  /**
   * Number of outgoing links from the node
   */
  weight: number;
  /**
   * Easied value in range [0,1] of weight used for visualization
   */
  easiedWeight: number;
}
