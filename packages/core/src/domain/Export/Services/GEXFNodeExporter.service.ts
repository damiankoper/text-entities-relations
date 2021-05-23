import { Service } from "typedi";
import { Graph } from "../../Graph/Models/Graph";
import { Attributes, TokenTypes } from "../GEXFConstants";
import { conf } from "../../Graph/data/Constants";
import * as d3 from "d3";

@Service()
export class GEXFNodeExporter {
  public exportNodes(graph: Graph): string {
    let result = "";
    const interpolate = d3.interpolateHsl(
      graph.weight.colorMin,
      graph.weight.colorMax
    );
    graph.nodes.forEach((node, index) => {
      const color = interpolate(node.easiedWeight || 0);
      const type =
        TokenTypes.find((t) => t.value === node.type || -1)?.label || "Unknown";
      result += `                <node id="${index}" label="${node.id}">
                <viz:color r="${this.getRed(color)}" g="${this.getGreen(
        color
      )}" b="${this.getBlue(color)}" a="0"/>
                <viz:position x="${node.x || 0}" y="${node.y || 0}" z="0.0"/>
                <viz:size value="${this.getNodeRadius(
                  node.easiedWeight || 0
                )}"/>
                <viz:shape value="disc"/>
                <attvalues>
                    <attvalue for="${Attributes.TOKEN_TYPE}" value="${type}"/>
                    <attvalue for="${Attributes.WEIGHT}" value="${
        node.weight
      }"/>
                    <attvalue for="${Attributes.RELATIONS_COUNT}" value="${
        node.relationsCount || 0
      }"/>
                    <attvalue for="${Attributes.NEIGHBOURS_COUNT}" value="${
        node.neighboursCount || 0
      }"/>
                </attvalues>
            </node>
`;
    });
    return result;
  }

  private getNodeRadius(weight: number) {
    const [min, max] = [conf.MIN_NODE_RADIUS, conf.MAX_NODE_RADIUS];
    return min + (max - min) * weight;
  }

  private getRed(color: string): number {
    const rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/) || "0";
    return parseInt(rgb[1]);
  }

  private getGreen(color: string): number {
    const rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/) || "0";
    return parseInt(rgb[2]);
  }

  private getBlue(color: string): number {
    const rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/) || "0";
    return parseInt(rgb[3]);
  }
}
