import Container, { Service } from "typedi";
import { defaultGraph, Graph } from "../Models";
import * as d3 from "d3";
import { Irs } from "domain/IndirectRelatationStructure";
import { conf } from "../data/Constants";

@Service()
export class GraphService {
  static get(): GraphService {
    return Container.get(GraphService);
  }

  // TODO: problem z wagą wierzchołków dla dynamicznego, filtrowanego IRSa po ponownym wyliczeniu
  buildGraphStructure(irs: Irs): Graph {
    const graph: Graph = defaultGraph();

    let maxWeight = 0;
    let minWeight = Infinity;
    let maxStrength = 0;
    let minStrength = Infinity;

    irs.entities.forEach((e) => {
      maxWeight = Math.max(maxWeight, e.relations.length);
      minWeight = Math.min(minWeight, e.relations.length);

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
          link.strength++;
          maxStrength = Math.max(maxStrength, link.strength);
          minStrength = Math.min(minStrength, link.strength);
        } else {
          maxStrength = Math.max(maxStrength, 1);
          minStrength = Math.min(minStrength, 1);
          graph.links.push({
            source: firstId,
            target: secondId,
            strength: 1,
          });
        }
      });
    });

    minStrength += 1; // every relation is counted twice

    const weightSpan = maxWeight - minWeight;
    const strengthSpan = maxStrength - minStrength;

    graph.nodes.forEach((n) => {
      const normalized = (n.weight - minWeight) / weightSpan;
      n.easiedWeight = d3.easeExpOut(normalized);
    });

    graph.links.forEach((l) => {
      const normalized = (l.strength - minStrength) / strengthSpan;
      l.easiedStrength = d3.easeQuadOut(normalized);
    });

    graph.weight.colorMin = conf.INT_FROM;
    graph.weight.colorMax = conf.INT_TO;
    graph.weight.min = minWeight;
    graph.weight.max = maxWeight;

    return graph;
  }
}
