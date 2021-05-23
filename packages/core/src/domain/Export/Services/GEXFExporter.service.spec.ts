import { GEXFExporter } from "./GEXFExporter.service";
import { GEXFNodeExporter } from "./GEXFNodeExporter.service";
import { GEXFEdgeExporter } from "./GEXFEdgeExporter.service";
import { testGraph } from "../data/TestGraph";
jest.mock("./GEXFEdgeExporter.service");
jest.mock("./GEXFNodeExporter.service");

describe("GEXFExporter", () => {
  const mockGEXFNodeExporter = new GEXFNodeExporter() as jest.Mocked<GEXFNodeExporter>;
  const mockGEXFEdgeExporter = new GEXFEdgeExporter() as jest.Mocked<GEXFEdgeExporter>;
  const exporter = new GEXFExporter(mockGEXFNodeExporter, mockGEXFEdgeExporter);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should export proper GEXF without nodes and edges", () => {
    const graph = testGraph;
    mockGEXFEdgeExporter.exportEdges.mockReturnValue("");
    mockGEXFNodeExporter.exportNodes.mockReturnValue("");
    exporter.exportGEXF(graph);

    expect(mockGEXFEdgeExporter.exportEdges).toHaveBeenCalled();
    expect(mockGEXFNodeExporter.exportNodes).toHaveBeenCalled();
  });
});
