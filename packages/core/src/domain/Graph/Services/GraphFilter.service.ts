import Container, { Service } from "typedi";
import levenshtein from "fast-levenshtein";
import { FilterParams, Graph, Node } from "../Models";

@Service()
export class GraphFilterService {
  static get(): GraphFilterService {
    return Container.get(GraphFilterService);
  }

  filter(graph: Graph, filter: FilterParams): Graph {
    const nodes = graph.nodes.filter(
      (node) =>
        node.weight >= filter.minWeight &&
        (!filter.name.values.length ||
          filter.name.values.some(
            (name) =>
              node.id.toLocaleLowerCase().includes(name.toLocaleLowerCase()) ||
              levenshtein.get(node.id, name) <= filter.name.maxDistance
          ))
    );

    const nodeIds = new Set(nodes.map((n) => n.id));

    const links = graph.links.filter(
      (l) =>
        nodeIds.has(this.getNodeName(l.source)) &&
        nodeIds.has(this.getNodeName(l.target))
    );

    return {
      ...graph,
      nodes,
      links,
    };
  }

  private getNodeName(node: string | number | Node): string {
    if (typeof node === "string") return node;
    if (typeof node === "number") return node.toString();
    return node.id;
  }
}
