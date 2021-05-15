import Container, { Service } from "typedi";
import { Graph } from "../Models/Graph";
import { NormalizedGraph } from "../data/SampleGraph";
import { Irs } from "domain/IndirectRelatationStructure";

@Service()
export class GraphService {
  private _graph: Graph;

  constructor() {
    this._graph = NormalizedGraph;
  }

  static get(): GraphService {
    return Container.get(GraphService);
  }

  buildGraphStructure(irs: Irs): Graph {
    const graph: Graph = {
      nodes: [],
      links: [],
    };

    irs.entities.forEach((e) => {
      graph.nodes.push({
        id: e.name,
        weight: e.relations.length,
        easiedWeight: 0,
      });

      e.relations.forEach((r) => {
        const [firstId, secondId] =
          e.name < r.target.name
            ? [e.name, r.target.name]
            : [r.target.name, e.name];

        const link = graph.links.find(
          (e) => e.source === firstId && e.target === secondId
        );

        if (link) {
          link.strength += 1;
        } else {
          graph.links.push({
            source: firstId,
            target: secondId,
            strength: 1,
            easiedStrength: 0,
          });
        }
      });
    });

    return graph;
  }

  deleteNode(nodeId: string): void {
    this._graph.nodes = this._graph.nodes.filter((d) => d.id !== nodeId);
    this._graph.links = this._graph.links.filter(
      (l) => l.source !== nodeId && l.target !== nodeId
    );
  }
}
