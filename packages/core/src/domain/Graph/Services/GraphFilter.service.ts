import Container, { Service } from "typedi";
import { FilterParams, Graph } from "../Models";

@Service()
export class GraphFilterService {
  static get(): GraphFilterService {
    return Container.get(GraphFilterService);
  }

  filter(graph: Graph, filter: FilterParams): Graph {
    // @see src/domain/IndirectRelatationStructure/Services/Irs.service.ts@146

    return graph;
  }
}
