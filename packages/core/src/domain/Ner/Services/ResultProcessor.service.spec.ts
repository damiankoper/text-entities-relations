import { ResultProcessor } from "./ResultProcessor.service";
import { ChunkListCreator } from "./ChunkListCreator.service";
import { ChunkList } from "../Models/ChunkList";
import axios from "axios";
import { NerEventDispatcher } from "./NerEventDispatcher.service";
import { ChunkCreator } from "./ChunkCreator.service";
jest.mock("./NerEventDispatcher.service");
jest.mock("./ChunkListCreator.service");
jest.mock("axios");

describe("ResultProcessor", () => {
  const mockEventDispatcher = new NerEventDispatcher() as jest.Mocked<NerEventDispatcher>;
  const mockChunkListCreator = new ChunkListCreator(
    {} as ChunkCreator
  ) as jest.Mocked<ChunkListCreator>;
  const resultProcessor = new ResultProcessor(
    mockChunkListCreator,
    mockEventDispatcher
  );

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    mockChunkListCreator.reset();
  });

  it("should try to hit proper APIUrls.RESULT URL", async () => {
    const NERData = {
      data:
        '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE chunkList SYSTEM "ccl.dtd"><chunkList><chunk><sentence><tok><orth>Woda</orth><lex disamb="1"><base>Wodo</base><ctag>NOUN</ctag></lex></tok><tok><orth>jest</orth><lex disamb="1"><base>jest</base><ctag>AUX</ctag></lex></tok><tok><orth>jedną</orth><lex disamb="1"><base>jeden</base><ctag>ADJ</ctag></lex></tok><tok><orth>z</orth><lex disamb="1"><base>z</base><ctag>ADP</ctag></lex></tok><tok><orth>najpospolitszych</orth><lex disamb="1"><base>pospolity</base><ctag>ADJ</ctag></lex></tok><tok><orth>substancji</orth><lex disamb="1"><base>substancja</base><ctag>NOUN</ctag></lex></tok><tok><orth>we</orth><lex disamb="1"><base>w</base><ctag>ADP</ctag></lex></tok><tok><orth>Wszechświecie</orth><lex disamb="1"><base>wszechświecie</base><ctag>PROPN</ctag></lex></tok><ns/><tok><orth>.</orth><lex disamb="1"><base>.</base><ctag>PUNCT</ctag></lex></tok></sentence><sentence><tok><orth>Woda</orth><lex disamb="1"><base>Wodo</base><ctag>NOUN</ctag></lex></tok><tok><orth>jest</orth><lex disamb="1"><base>jest</base><ctag>AUX</ctag></lex></tok><tok><orth>jedną</orth><lex disamb="1"><base>jeden</base><ctag>ADJ</ctag></lex></tok><tok><orth>z</orth><lex disamb="1"><base>z</base><ctag>ADP</ctag></lex></tok><tok><orth>najpospolitszych</orth><lex disamb="1"><base>pospolity</base><ctag>ADJ</ctag></lex></tok><tok><orth>substancji</orth><lex disamb="1"><base>substancja</base><ctag>NOUN</ctag></lex></tok><tok><orth>we</orth><lex disamb="1"><base>w</base><ctag>ADP</ctag></lex></tok><tok><orth>Wszechświecie</orth><lex disamb="1"><base>wszechświecie</base><ctag>PROPN</ctag></lex></tok><ns/><tok><orth>.</orth><lex disamb="1"><base>.</base><ctag>PUNCT</ctag></lex></tok></sentence></chunk><chunk><sentence><tok><orth>Woda</orth><lex disamb="1"><base>Wodo</base><ctag>NOUN</ctag></lex></tok><tok><orth>jest</orth><lex disamb="1"><base>jest</base><ctag>AUX</ctag></lex></tok><tok><orth>jedną</orth><lex disamb="1"><base>jeden</base><ctag>ADJ</ctag></lex></tok><tok><orth>z</orth><lex disamb="1"><base>z</base><ctag>ADP</ctag></lex></tok><tok><orth>najpospolitszych</orth><lex disamb="1"><base>pospolity</base><ctag>ADJ</ctag></lex></tok><tok><orth>substancji</orth><lex disamb="1"><base>substancja</base><ctag>NOUN</ctag></lex></tok><tok><orth>we</orth><lex disamb="1"><base>w</base><ctag>ADP</ctag></lex></tok><tok><orth>Wszechświecie</orth><lex disamb="1"><base>wszechświecie</base><ctag>PROPN</ctag></lex></tok><ns/><tok><orth>.</orth><lex disamb="1"><base>.</base><ctag>PUNCT</ctag></lex></tok></sentence><sentence><tok><orth>Woda</orth><lex disamb="1"><base>Wodo</base><ctag>NOUN</ctag></lex></tok><tok><orth>jest</orth><lex disamb="1"><base>jest</base><ctag>AUX</ctag></lex></tok><tok><orth>jedną</orth><lex disamb="1"><base>jeden</base><ctag>ADJ</ctag></lex></tok><tok><orth>z</orth><lex disamb="1"><base>z</base><ctag>ADP</ctag></lex></tok><tok><orth>najpospolitszych</orth><lex disamb="1"><base>pospolity</base><ctag>ADJ</ctag></lex></tok><tok><orth>substancji</orth><lex disamb="1"><base>substancja</base><ctag>NOUN</ctag></lex></tok><tok><orth>we</orth><lex disamb="1"><base>w</base><ctag>ADP</ctag></lex></tok><tok><orth>Wszechświecie</orth><lex disamb="1"><base>wszechświecie</base><ctag>PROPN</ctag></lex></tok><ns/><tok><orth>.</orth><lex disamb="1"><base>.</base><ctag>PUNCT</ctag></lex></tok></sentence></chunk></chunkList>',
    };
    const testChunkList: ChunkList = [];
    mockChunkListCreator.createChunkList.mockReturnValue(testChunkList);
    const spyAxios = jest.spyOn(axios, "get");
    spyAxios.mockResolvedValue(NERData);
    const resultHandle = "/test";
    await resultProcessor.processResult(resultHandle);

    expect(mockChunkListCreator.createChunkList).toHaveBeenCalled();
    expect(spyAxios).toHaveBeenCalled();
    expect(spyAxios).toHaveBeenCalledWith(
      "https://ws.clarin-pl.eu/nlprest2/base/download" + resultHandle
    );
  });

  it("should try to hit proper APIUrls.RESULT URL and miss", async () => {
    mockEventDispatcher.dispatchFetchingError.mockReturnValue();
    const testChunkList: ChunkList = [];
    mockChunkListCreator.createChunkList.mockReturnValue(testChunkList);
    const spyAxios = jest.spyOn(axios, "get");
    spyAxios.mockRejectedValue(new Error("test"));
    const resultHandle = "/test";
    try {
      await resultProcessor.processResult(resultHandle);
    } catch (error) {
      expect(mockEventDispatcher.dispatchFetchingError).toHaveBeenCalled();
      expect(mockChunkListCreator.createChunkList).not.toHaveBeenCalled();
    }
  });
});
