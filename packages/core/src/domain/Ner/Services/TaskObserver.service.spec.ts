import { TaskObserver } from "./TaskObserver.service";
import { ResultProcessor } from "./ResultProcessor.service";
import { ChunkList } from "../Models/ChunkList";
import axios from "axios";
import { NerEventDispatcher } from "./NerEventDispatcher.service";
import { ChunkListCreator } from "./ChunkListCreator.service";
import { Chunk } from "../Models/Chunk";
jest.mock("./NerEventDispatcher.service");
jest.mock("./ResultProcessor.service");
jest.mock("axios");

describe("TaskObserver", () => {
  const mockEventDispatcher = new NerEventDispatcher() as jest.Mocked<NerEventDispatcher>;
  const mockResultProcessor = new ResultProcessor(
    {} as ChunkListCreator,
    mockEventDispatcher
  ) as jest.Mocked<ResultProcessor>;
  const taskObserver = new TaskObserver(
    mockResultProcessor,
    mockEventDispatcher
  );

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    mockResultProcessor.reset();
  });

  it("should try to hit proper APIUrls.STATUS URL", async () => {
    const dataProcessing = {
      data: { value: 0.3333333333333333, status: "PROCESSING" },
    };
    const dataDone = {
      data: {
        value: [
          {
            name: "file",
            fileID: "/requests/spacy/c3c13c84-3578-43bb-840b-ba14c5fa1b99",
          },
        ],
        status: "DONE",
      },
    };
    const testChunkList: ChunkList = [];
    mockResultProcessor.processResult.mockResolvedValue(testChunkList);
    mockEventDispatcher.dispatchProgress.mockReturnValue();
    mockEventDispatcher.dispatchSuccess.mockReturnValue();
    const spyAxios = jest.spyOn(axios, "get");
    spyAxios
      .mockResolvedValueOnce(dataProcessing)
      .mockResolvedValueOnce(dataProcessing)
      .mockResolvedValue(dataDone);
    const taskHandle = "test";
    await taskObserver.observeTask(taskHandle);

    expect(mockEventDispatcher.dispatchProgress).toHaveBeenCalledTimes(3);
    expect(mockEventDispatcher.dispatchSuccess).toHaveBeenCalledTimes(1);
    expect(mockEventDispatcher.dispatchProgress).toHaveBeenNthCalledWith(
      1,
      0.3333333333333333
    );
    expect(mockEventDispatcher.dispatchProgress).toHaveBeenNthCalledWith(
      2,
      0.3333333333333333
    );
    expect(mockEventDispatcher.dispatchProgress).toHaveBeenNthCalledWith(3, 1);
    expect(mockEventDispatcher.dispatchSuccess).toHaveBeenCalledWith(
      testChunkList
    );
    expect(spyAxios).toHaveBeenCalledTimes(3);
    expect(spyAxios).toHaveBeenCalledWith(
      "https://ws.clarin-pl.eu/nlprest2/base/getStatus/" + taskHandle
    );
  });

  it("should try to hit proper APIUrls.STATUS URL and work on two files", async () => {
    const dataProcessing = {
      data: { value: 0.3333333333333333, status: "PROCESSING" },
    };
    const dataDone = {
      data: {
        value: [
          {
            name: "file1",
            fileID: "/requests/spacy/c3c13c84-3578-43bb-840b-ba14c5fa1b99",
          },
          {
            name: "file2",
            fileID: "/requests/spacy/c3c13c84-3578-43bb-840b-ba14c5fa1b99",
          },
        ],
        status: "DONE",
      },
    };
    const testChunk: Chunk = { chunkIndex: 0, sentences: [] };
    const testChunkList: ChunkList = [testChunk];
    const resultChunkList: ChunkList = [testChunk, testChunk];
    mockResultProcessor.processResult.mockResolvedValue(testChunkList);
    mockEventDispatcher.dispatchProgress.mockReturnValue();
    mockEventDispatcher.dispatchSuccess.mockReturnValue();
    const spyAxios = jest.spyOn(axios, "get");
    spyAxios
      .mockResolvedValueOnce(dataProcessing)
      .mockResolvedValueOnce(dataProcessing)
      .mockResolvedValue(dataDone);
    const taskHandle = "test";
    await taskObserver.observeTask(taskHandle);

    expect(mockEventDispatcher.dispatchSuccess).toHaveBeenCalledWith(
      resultChunkList
    );
  });

  it("should try to hit proper APIUrls.STATUS URL and miss", async () => {
    mockEventDispatcher.dispatchTaskCheckingError.mockReturnValue();
    const testChunkList: ChunkList = [];
    mockResultProcessor.processResult.mockResolvedValue(testChunkList);
    const spyAxios = jest.spyOn(axios, "get");
    spyAxios.mockRejectedValue(new Error("test"));
    const taskHandle = "test";
    try {
      await taskObserver.observeTask(taskHandle);
    } catch (error) {
      expect(mockEventDispatcher.dispatchTaskCheckingError).toHaveBeenCalled();
      expect(mockResultProcessor.processResult).not.toHaveBeenCalled();
    }
  });

  it("should try to hit proper APIUrls.STATUS URL and get ERROR", async () => {
    const dataError = {
      data: { value: "Error info", status: "ERROR" },
    };
    mockEventDispatcher.dispatchProcessingError.mockReturnValue();
    const testChunkList: ChunkList = [];
    mockResultProcessor.processResult.mockResolvedValue(testChunkList);
    const spyAxios = jest.spyOn(axios, "get");
    spyAxios.mockResolvedValue(dataError);
    const taskHandle = "test";
    try {
      await taskObserver.observeTask(taskHandle);
    } catch (error) {
      expect(mockEventDispatcher.dispatchProcessingError).toHaveBeenCalled();
      expect(mockResultProcessor.processResult).not.toHaveBeenCalled();
    }
  });

  it("should try to work on data but get an error", async () => {
    const dataDone = {
      data: {
        value: [
          {
            name: "file1",
            fileID: "/requests/spacy/c3c13c84-3578-43bb-840b-ba14c5fa1b99",
          },
        ],
        status: "DONE",
      },
    };
    mockResultProcessor.processResult.mockRejectedValue(null);
    mockEventDispatcher.dispatchProgress.mockReturnValue();
    mockEventDispatcher.dispatchSuccess.mockReturnValue();
    const spyAxios = jest.spyOn(axios, "get");
    spyAxios.mockResolvedValue(dataDone);
    const taskHandle = "test";
    try {
      await taskObserver.observeTask(taskHandle);
    } catch (error) {
      expect(error).toBe(null);
    }
  });
});
