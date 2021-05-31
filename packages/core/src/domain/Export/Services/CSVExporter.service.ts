import Container, { Service } from "typedi";
import { Graph } from "../../Graph/Models/Graph";
import { TokenTypes } from "../GEXFConstants";

@Service()
export class CSVExporter {
  static get(): CSVExporter {
    return Container.get(CSVExporter);
  }

  public exportCSV(graph: Graph): string {
    let result = "";
    result += "src,dst,strength,type,src_weight,src_neighbours,src_relations\n";
    for (const link of graph.links) {
      const source = graph.nodes.find((node) => {
        return node.id == link.source;
      });
      const target = graph.nodes.find((node) => {
        return node.id == link.target;
      });

      const type =
        TokenTypes.find((t) => t.value == source?.type)?.label || "Unknown";

      result += `${link.source},${link.target},${link.strength},${type},${
        source?.weight || 0
      },${source?.neighboursCount || 0},${source?.relationsCount || 0}
`;
      result += `${link.target},${link.source},${link.strength},${type},${
        target?.weight || 0
      },${target?.neighboursCount || 0},${target?.relationsCount || 0}
`;
    }
    return result;
  }
}
