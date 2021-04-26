import { FileProcessor } from "./FileProcessor.service";
import { TaskHandler } from "./TaskHandler.service";
import axios from "axios";
import { TaskObserver } from "./TaskObserver.service";
import { Language } from "../Models/Language";
import { NerEventDispatcher } from "./NerEventDispatcher.service";
import { FileType } from "../Models/FileType";
jest.mock("./NerEventDispatcher.service");
jest.mock("./TaskHandler.service");
jest.mock("axios");

describe("FileProcessor", () => {
  const mockEventDispatcher = new NerEventDispatcher() as jest.Mocked<NerEventDispatcher>;
  const mockTaskHandler = new TaskHandler(
    {} as TaskObserver,
    mockEventDispatcher
  ) as jest.Mocked<TaskHandler>;
  const fileProcessor = new FileProcessor(mockTaskHandler, mockEventDispatcher);
  jest.mock("axios");
  const properHeader = {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  };
  const file = new ArrayBuffer(0);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should hit APIUrls.UPLOAD URL and start task for archive", async () => {
    const fileType = FileType.ARCHIVE;
    const language = Language.PL;
    const NERData = {
      data: "/users/default/9d0c0893-5c00-4ca8-8479-77f467c0fb4c",
    };
    mockTaskHandler.startTaskArchive.mockResolvedValue(null);
    const spyAxios = jest.spyOn(axios, "post");
    spyAxios.mockResolvedValue(NERData);
    await fileProcessor.process(file, fileType, language);

    expect(mockTaskHandler.startTaskArchive).toHaveBeenCalled();
    expect(spyAxios).toHaveBeenCalled();
    expect(spyAxios).toHaveBeenCalledWith(
      "https://ws.clarin-pl.eu/nlprest2/base/upload/",
      file,
      properHeader
    );
  });

  it("should hit APIUrls.UPLOAD URL and start task for document", async () => {
    const fileType = FileType.DOCUMENT;
    const language = Language.PL;
    const NERData = {
      data: "/users/default/9d0c0893-5c00-4ca8-8479-77f467c0fb4c",
    };
    mockTaskHandler.startTaskDocument.mockResolvedValue(null);
    const spyAxios = jest.spyOn(axios, "post");
    spyAxios.mockResolvedValue(NERData);
    await fileProcessor.process(file, fileType, language);

    expect(mockTaskHandler.startTaskDocument).toHaveBeenCalled();
    expect(spyAxios).toHaveBeenCalled();
    expect(spyAxios).toHaveBeenCalledWith(
      "https://ws.clarin-pl.eu/nlprest2/base/upload/",
      file,
      properHeader
    );
  });

  it("should try to hit APIUrls.UPLOAD URL and miss", async () => {
    const fileType = FileType.ARCHIVE;
    const language = Language.PL;
    mockTaskHandler.startTaskArchive.mockResolvedValue(null);
    mockEventDispatcher.dispatchUploadingError.mockReturnValue();
    const spyAxios = jest.spyOn(axios, "post");
    spyAxios.mockRejectedValue(new Error("test"));
    try {
      await fileProcessor.process(file, fileType, language);
    } catch (error) {
      expect(mockTaskHandler.startTaskArchive).not.toHaveBeenCalled();
      expect(mockTaskHandler.startTaskDocument).not.toHaveBeenCalled();
      expect(mockEventDispatcher.dispatchUploadingError).toHaveBeenCalled();
    }
  });

  it("should try to analyze archive and get ERROR", async () => {
    const NERData = {
      data: "/users/default/9d0c0893-5c00-4ca8-8479-77f467c0fb4c",
    };
    const file = new ArrayBuffer(0);
    const fileType = FileType.ARCHIVE;
    const language = Language.PL;
    mockTaskHandler.startTaskArchive.mockRejectedValue(null);
    const spyAxios = jest.spyOn(axios, "post");
    spyAxios.mockResolvedValue(NERData);
    try {
      await fileProcessor.process(file, fileType, language);
    } catch (error) {
      expect(error).toBe(null);
    }
  });

  it("should try to analyze document and get ERROR", async () => {
    const NERData = {
      data: "/users/default/9d0c0893-5c00-4ca8-8479-77f467c0fb4c",
    };
    const file = new ArrayBuffer(0);
    const fileType = FileType.DOCUMENT;
    const language = Language.PL;
    mockTaskHandler.startTaskDocument.mockRejectedValue(null);
    const spyAxios = jest.spyOn(axios, "post");
    spyAxios.mockResolvedValue(NERData);
    try {
      await fileProcessor.process(file, fileType, language);
    } catch (error) {
      expect(error).toBe(null);
    }
  });
});
