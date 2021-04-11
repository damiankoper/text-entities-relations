import Container, { Service } from "typedi";
import { Graph } from "../Models/Graph";
import { SampleGraph } from "../data/SampleGraph";

@Service()
export class GraphService {
  private _graph: Graph = SampleGraph;

  static get(): GraphService {
    return Container.get(GraphService);
  }

  buildGraphStructure(inputStructure: any): Graph {
    return this._graph;
  }
}
