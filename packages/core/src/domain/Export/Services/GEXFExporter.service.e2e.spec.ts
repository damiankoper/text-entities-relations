import { GEXFExporter } from "./GEXFExporter.service";
import { GEXFNodeExporter } from "./GEXFNodeExporter.service";
import { GEXFEdgeExporter } from "./GEXFEdgeExporter.service";
import { testGraph } from "../data/TestGraph";

describe("GEXFExporter", () => {
  const nodeExporter = new GEXFNodeExporter();
  const edgeExporter = new GEXFEdgeExporter();
  const exporter = new GEXFExporter(nodeExporter, edgeExporter);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should export proper GEXF", () => {
    const graph = testGraph;
    const result = exporter.exportGEXF(graph);
    const numberOfNodes = (result.match(new RegExp("<node id", "g")) || [])
      .length;
    const numberOfEdges = (result.match(new RegExp("<edge id", "g")) || [])
      .length;

    expect(numberOfEdges).toEqual(7);
    expect(numberOfNodes).toEqual(8);
  });
});
