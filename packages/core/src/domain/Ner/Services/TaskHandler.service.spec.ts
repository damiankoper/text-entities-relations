import { TaskHandler } from "./TaskHandler.service";
import { TaskObserver } from "./TaskObserver.service";
import axios from "axios";
import { ResultProcessor } from "./ResultProcessor.service";
import { NerEventDispatcher } from "./NerEventDispatcher.service";
import { Language } from "../Models/Language";
jest.mock("./NerEventDispatcher.service");
jest.mock("./TaskObserver.service");
jest.mock("axios");

describe("TaskHandler", () => {
  const mockEventDispatcher = new NerEventDispatcher() as jest.Mocked<NerEventDispatcher>;
  const mockTaskObserver = new TaskObserver(
    {} as ResultProcessor,
    mockEventDispatcher
  ) as jest.Mocked<TaskObserver>;
  const taskHandler = new TaskHandler(mockTaskObserver, mockEventDispatcher);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should hit APIUrls.START URL and tell it to use zip file", async () => {
    const fileHandle = "/test";
    const language = Language.PL;
    const NERData = {
      data: "00d43a5d-336a-4725-9e2f-9830650f6f90",
    };
    const properHeader = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const properData = {
      lpmn:
        "filezip(" +
        fileHandle +
        ")|" +
        'any2txt|spacy({"method":"ner","lang":"' +
        language +
        '"})',
      user: "Grupa D",
    };
    mockTaskObserver.observeTask.mockResolvedValue(null);
    const spyAxios = jest.spyOn(axios, "post");
    spyAxios.mockResolvedValue(NERData);
    await taskHandler.startTaskArchive(fileHandle, language);

    expect(mockTaskObserver.observeTask).toHaveBeenCalled();
    expect(spyAxios).toHaveBeenCalled();
    expect(spyAxios).toHaveBeenCalledWith(
      "https://ws.clarin-pl.eu/nlprest2/base/startTask/",
      properData,
      properHeader
    );
  });

  it("should hit APIUrls.START URL and tell it to use document file", async () => {
    const fileHandle = "/test";
    const language = Language.PL;
    const NERData = {
      data: "00d43a5d-336a-4725-9e2f-9830650f6f90",
    };
    const properHeader = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const properData = {
      lpmn: 'any2txt|spacy({"method":"ner","lang":"' + language + '"})',
      file: fileHandle,
      user: "Grupa D",
    };
    mockTaskObserver.observeTask.mockResolvedValue(null);
    const spyAxios = jest.spyOn(axios, "post");
    spyAxios.mockResolvedValue(NERData);
    await taskHandler.startTaskDocument(fileHandle, language);

    expect(mockTaskObserver.observeTask).toHaveBeenCalled();
    expect(spyAxios).toHaveBeenCalled();
    expect(spyAxios).toHaveBeenCalledWith(
      "https://ws.clarin-pl.eu/nlprest2/base/startTask/",
      properData,
      properHeader
    );
  });

  it("should try to hit APIUrls.START URL and miss", async () => {
    mockEventDispatcher.dispatchTaskStartingError.mockReturnValue();
    mockTaskObserver.observeTask.mockResolvedValue(null);
    const spyAxios = jest.spyOn(axios, "post");
    spyAxios.mockRejectedValue(new Error("test"));
    const fileHandle = "/test";
    const language = Language.PL;
    try {
      await taskHandler.startTaskArchive(fileHandle, language);
    } catch (error) {
      expect(mockTaskObserver.observeTask).not.toHaveBeenCalled();
      expect(mockEventDispatcher.dispatchTaskStartingError).toHaveBeenCalled();
    }
  });

  it("should try to observe task and get ERROR", async () => {
    const NERData = {
      data: "00d43a5d-336a-4725-9e2f-9830650f6f90",
    };
    mockTaskObserver.observeTask.mockRejectedValue(null);
    const spyAxios = jest.spyOn(axios, "post");
    spyAxios.mockResolvedValue(NERData);
    const fileHandle = "/test";
    const language = Language.PL;
    try {
      await taskHandler.startTaskArchive(fileHandle, language);
    } catch (error) {
      expect(error).toBe(null);
    }
  });
});
