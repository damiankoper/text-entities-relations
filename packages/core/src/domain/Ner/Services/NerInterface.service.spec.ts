import { NerInterfaceService } from "./NerInterface.service";
import { FileProcessor } from "./FileProcessor.service";
import { TaskHandler } from "./TaskHandler.service";
import { NEREventDispatcher } from "./NEREventDispatcher.service";
import { Language } from "../Models/Language";
//import { ChunkList } from "../Models/ChunkList";
jest.mock("./FileProcessor.service");
jest.mock("./NEREventDispatcher.service");

describe("NerInterfaceService", () => {
  const mockEventDispatcher = new NEREventDispatcher() as jest.Mocked<NEREventDispatcher>;
  const mockFileProcessor = new FileProcessor(
    {} as TaskHandler,
    mockEventDispatcher
  ) as jest.Mocked<FileProcessor>;
  const service = new NerInterfaceService(
    mockFileProcessor,
    mockEventDispatcher
  );

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should start processing file", async () => {
    const file = Buffer.from("", "base64");
    const fileType = "zip";
    const language = Language.PL;
    mockFileProcessor.process.mockResolvedValue(null);
    await service.processFile(file, fileType, language);

    expect(mockFileProcessor.process).toHaveBeenCalledTimes(1);
    expect(mockFileProcessor.process).toHaveBeenCalledWith(
      file,
      fileType,
      language
    );
  });
  /*
  it("lol", async () => {
    const dataBase64 =
      "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";
    const file = Buffer.from(dataBase64, "base64");
    const fileType = "zip";
    const language = Language.PL;
    const NERInterface = NerInterfaceService.get();
    let chunkList: ChunkList = [];
    NERInterface.onSuccess.subscribe((result) => {
      chunkList = result;
    });
    await NERInterface.processFile(file, fileType, language);

    expect(chunkList.length).toBe(1);
    expect(chunkList[0].sentences.length).toBe(15);
    expect(chunkList[0].sentences[0].tokens.length).toBe(1);
    expect(chunkList[0].sentences[1].tokens.length).toBe(0);
    expect(chunkList[0].sentences[2].tokens.length).toBe(2);
    expect(chunkList[0].sentences[3].tokens.length).toBe(0);
    expect(chunkList[0].sentences[4].tokens.length).toBe(1);
    expect(chunkList[0].sentences[5].tokens.length).toBe(0);
    expect(chunkList[0].sentences[6].tokens.length).toBe(0);
    expect(chunkList[0].sentences[7].tokens.length).toBe(0);
    expect(chunkList[0].sentences[8].tokens.length).toBe(1);
    expect(chunkList[0].sentences[9].tokens.length).toBe(0);
    expect(chunkList[0].sentences[10].tokens.length).toBe(0);
    expect(chunkList[0].sentences[11].tokens.length).toBe(0);
    expect(chunkList[0].sentences[12].tokens.length).toBe(0);
    expect(chunkList[0].sentences[13].tokens.length).toBe(0);
    expect(chunkList[0].sentences[14].tokens.length).toBe(0);
  });*/
});
