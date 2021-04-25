import { NerInterfaceService } from "./NerInterface.service";
import { FileProcessor } from "./FileProcessor.service";
import { TaskHandler } from "./TaskHandler.service";
import { NerEventDispatcher } from "./NerEventDispatcher.service";
import { Language } from "../Models/Language";
import { FileType } from "../Models/FileType";
jest.mock("./FileProcessor.service");
jest.mock("./NerEventDispatcher.service");

describe("NerInterfaceService", () => {
  const mockEventDispatcher = new NerEventDispatcher() as jest.Mocked<NerEventDispatcher>;
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
    const file = new ArrayBuffer(0);
    const fileType = FileType.ARCHIVE;
    const language = Language.PL;
    mockFileProcessor.process.mockResolvedValue();
    await service.processFile(file, fileType, language);

    expect(mockFileProcessor.process).toHaveBeenCalledTimes(1);
    expect(mockFileProcessor.process).toHaveBeenCalledWith(
      file,
      fileType,
      language
    );
  });

  it("should start processing file but get a fail", async () => {
    const file = new ArrayBuffer(0);
    const fileType = FileType.ARCHIVE;
    const language = Language.PL;
    const err = new Error("error");
    mockFileProcessor.process.mockRejectedValue(err);

    const result = service.processFile(file, fileType, language);

    expect(result).rejects.toEqual(err);
    expect(mockFileProcessor.process).toHaveBeenCalledTimes(1);
    expect(mockFileProcessor.process).toHaveBeenCalledWith(
      file,
      fileType,
      language
    );
  });
});
