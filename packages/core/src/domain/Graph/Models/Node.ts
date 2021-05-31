import { SimulationNodeDatum } from "d3";
import { TokenType } from "domain/Ner/Models/TokenType";

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
  easiedWeight?: number;
  /**
   * Type from NER
   */
  type?: TokenType;
  relationsCount?: number;
  neighboursCount?: number;
  highlighted?: boolean;
  pinned?: boolean;
}
