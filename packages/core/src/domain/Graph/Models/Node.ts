import { SimulationNodeDatum } from "d3-force";

export interface Node extends SimulationNodeDatum {
  id: string;
  group: number;
}
