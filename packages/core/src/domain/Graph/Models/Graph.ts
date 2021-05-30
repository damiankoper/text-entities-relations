import { Link } from "./Link";
import { Node } from "./Node";

export interface Graph {
  nodes: Array<Node>;
  links: Array<Link>;
  weight: {
    min: number;
    max: number;
    colorMin: string;
    colorMax: string;
  };
}

export const defaultGraph = (): Graph => ({
  links: [],
  nodes: [],
  weight: {
    min: 0,
    max: 0,
    colorMin: "#fff",
    colorMax: "#fff",
  },
});
