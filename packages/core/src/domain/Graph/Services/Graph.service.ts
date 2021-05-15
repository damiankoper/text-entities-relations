import Container, { Service } from "typedi";
import { Graph, d3 } from "../Models";
import { Irs } from "domain/IndirectRelatationStructure";

@Service()
export class GraphService {
  static get(): GraphService {
    return Container.get(GraphService);
  }

  buildGraphStructure(irs?: Irs): Graph | null {
    if (!irs) return null;

    const graph: Graph = {
      nodes: [],
      links: [],
    };

    let maxWeight = 1;
    let maxStrength = 1;

    irs.entities.forEach((e) => {
      if (e.relations.length > maxWeight) maxWeight = e.relations.length;

      graph.nodes.push({
        id: e.name,
        weight: e.relations.length,
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
          if (link.strength > maxStrength) maxStrength = link.strength;
        } else {
          graph.links.push({
            source: firstId,
            target: secondId,
            strength: 1,
          });
        }
      });
    });

    graph.nodes.forEach((n) => {
      n.easiedWeight = d3.easeExpOut(n.weight / maxWeight);
    });

    graph.links.forEach((l) => {
      l.easiedStrength = d3.easeExpOut(l.strength / maxStrength);
    });

    return graph;
  }
}
