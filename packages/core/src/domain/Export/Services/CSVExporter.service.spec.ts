import { CSVExporter } from "./CSVExporter.service";
import { testGraph } from "../data/TestGraph";

describe("CSVExporter", () => {
  const exporter = new CSVExporter();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should export proper CSV", () => {
    const graph = testGraph;
    const result = exporter.exportCSV(graph);
    const resultAsArray = result.split("\n");
    resultAsArray.pop();
    const numberOfLines = resultAsArray.length;

    expect(numberOfLines).toEqual(15);
  });
});
