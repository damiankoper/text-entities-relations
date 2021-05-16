import Container, { Service } from "typedi";
import { Graph } from "../Models";
import * as d3 from "d3";
import { Irs } from "domain/IndirectRelatationStructure";

@Service()
export class GraphService {
  static get(): GraphService {
    return Container.get(GraphService);
  }

  buildGraphStructure(irs: Irs): Graph {
    const graph: Graph = {
      nodes: [],
      links: [],
    };

    let maxWeight = 0;
    let minWeight = Infinity;
    let maxStrength = 0;
    let minStrength = Infinity;

    irs.entities.forEach((e) => {
      maxWeight = Math.max(maxWeight, e.relations.length);
      minWeight = Math.min(minWeight, e.relations.length);
      maxStrength = Math.max(maxStrength, e.relations.length);
      minStrength = Math.min(minStrength, e.relations.length);

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

    const weightSpan = maxWeight - minWeight;
    const strengthSpan = maxStrength - minStrength;

    const easeFn = d3.easeExpOut;

    graph.nodes.forEach((n) => {
      const normalized = (n.weight - minWeight) / weightSpan;
      n.easiedWeight = easeFn(normalized);
    });

    graph.links.forEach((l) => {
      const normalized = (l.strength - minStrength) / strengthSpan;
      l.easiedStrength = easeFn(normalized);
    });

    return graph;
  }
}
