import Container, { Service } from "typedi";
import { Graph } from "../../Graph/Models/Graph";
import { GEXFNodeExporter } from "./GEXFNodeExporter.service";
import { GEXFEdgeExporter } from "./GEXFEdgeExporter.service";
import { Attributes } from "../GEXFConstants";

@Service()
export class GEXFExporter {
  constructor(
    private nodeExporter: GEXFNodeExporter,
    private edgeExporter: GEXFEdgeExporter
  ) {}

  static get(): GEXFExporter {
    return Container.get(GEXFExporter);
  }

  public exportGEXF(graph: Graph): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <gexf xmlns="http://www.gexf.net/1.2draft" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:viz="http://www.gexf.net/1.1draft/viz" xsi:schemaLocation="http://www.gexf.net/1.2draft http://www.gexf.net/1.2draft/gexf.xsd" version="1.2">
        <meta lastmodifieddate="2009-03-20">
            <creator>TER</creator>
            <description>Text entities relationship diagram</description>
        </meta>
        <graph defaultedgetype="undirected">
            <attributes class="node">
                <attribute id="${
                  Attributes.WEIGHT
                }" title="Weight" type="float"/>
                <attribute id="${
                  Attributes.TOKEN_TYPE
                }" title="Type" type="string"/>
                <attribute id="${
                  Attributes.RELATIONS_COUNT
                }" title="Number of relations" type="float"/>
                <attribute id="${
                  Attributes.NEIGHBOURS_COUNT
                }" title="Number of neighbours" type="float"/>
            </attributes>
            <nodes>
${this.nodeExporter.exportNodes(graph)}            </nodes>
            <edges>
${this.edgeExporter.exportEdges(graph)}            </edges>
        </graph>
    </gexf>`;
  }
}
