import { GEXFNodeExporter } from "./GEXFNodeExporter.service";
import { testGraph } from "../data/TestGraph";

describe("GEXFNodeExporter", () => {
  const exporter = new GEXFNodeExporter();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should export nodes", () => {
    const graph = testGraph;
    const result = exporter.exportNodes(graph);
    const numberOfNodes = (result.match(new RegExp("<node id", "g")) || [])
      .length;

    expect(numberOfNodes).toEqual(8);
  });
});
