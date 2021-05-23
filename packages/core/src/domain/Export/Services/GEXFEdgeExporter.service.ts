import { Service } from "typedi";
import { Graph } from "../../Graph/Models/Graph";

@Service()
export class GEXFEdgeExporter {
  public exportEdges(graph: Graph): string {
    let result = "";
    graph.links.forEach((link, index) => {
      const source = graph.nodes.findIndex((node) => {
        return node.id == link.source;
      });
      const target = graph.nodes.findIndex((node) => {
        return node.id == link.target;
      });
      result += `                <edge id="${index}" source="${source}" target="${target}"/>
`;
    });
    return result;
  }
}
