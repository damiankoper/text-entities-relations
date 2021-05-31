import { GEXFEdgeExporter } from "./GEXFEdgeExporter.service";
import { testGraph } from "../data/TestGraph";

describe("GEXFEdgeExporter", () => {
  const exporter = new GEXFEdgeExporter();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should export edges", () => {
    const graph = testGraph;
    const result = exporter.exportEdges(graph);
    const numberOfEdges = (result.match(new RegExp("<edge id", "g")) || [])
      .length;

    expect(numberOfEdges).toEqual(7);
  });
});
