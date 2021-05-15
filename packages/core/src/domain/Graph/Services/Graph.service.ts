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
    return { ...this._graph };
  }

  deleteNode(nodeId: string): void {
    this._graph.nodes = this._graph.nodes.filter((d) => d.id !== nodeId);
    this._graph.links = this._graph.links.filter(
      (l) => l.source !== nodeId && l.target !== nodeId
    );
  }
}
