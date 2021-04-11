import { Link } from "./Link";
import { Node } from "./Node";

export interface Graph {
  nodes: Array<Node>;
  links: Array<Link>;
}
