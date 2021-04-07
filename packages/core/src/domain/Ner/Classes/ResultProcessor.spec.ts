import { ResultProcessor } from "./ResultProcessor";
import { ChunkListCreator } from "./ChunkListCreator";
import { ChunkList } from "../Models/ChunkList";
import axios from "axios";
import { SimpleEventDispatcher } from "strongly-typed-events";

describe("ResultProcessor", () => {
  let resultProcessor: ResultProcessor;
  const _onError = new SimpleEventDispatcher<string>();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    resultProcessor = new ResultProcessor(_onError);
  });

  it("should try to hit proper APIUrls.RESULT URL", async () => {
    const NERData = {
      data:
        '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE chunkList SYSTEM "ccl.dtd"><chunkList><chunk><sentence><tok><orth>Woda</orth><lex disamb="1"><base>Wodo</base><ctag>NOUN</ctag></lex></tok><tok><orth>jest</orth><lex disamb="1"><base>jest</base><ctag>AUX</ctag></lex></tok><tok><orth>jedną</orth><lex disamb="1"><base>jeden</base><ctag>ADJ</ctag></lex></tok><tok><orth>z</orth><lex disamb="1"><base>z</base><ctag>ADP</ctag></lex></tok><tok><orth>najpospolitszych</orth><lex disamb="1"><base>pospolity</base><ctag>ADJ</ctag></lex></tok><tok><orth>substancji</orth><lex disamb="1"><base>substancja</base><ctag>NOUN</ctag></lex></tok><tok><orth>we</orth><lex disamb="1"><base>w</base><ctag>ADP</ctag></lex></tok><tok><orth>Wszechświecie</orth><lex disamb="1"><base>wszechświecie</base><ctag>PROPN</ctag></lex></tok><ns/><tok><orth>.</orth><lex disamb="1"><base>.</base><ctag>PUNCT</ctag></lex></tok></sentence><sentence><tok><orth>Woda</orth><lex disamb="1"><base>Wodo</base><ctag>NOUN</ctag></lex></tok><tok><orth>jest</orth><lex disamb="1"><base>jest</base><ctag>AUX</ctag></lex></tok><tok><orth>jedną</orth><lex disamb="1"><base>jeden</base><ctag>ADJ</ctag></lex></tok><tok><orth>z</orth><lex disamb="1"><base>z</base><ctag>ADP</ctag></lex></tok><tok><orth>najpospolitszych</orth><lex disamb="1"><base>pospolity</base><ctag>ADJ</ctag></lex></tok><tok><orth>substancji</orth><lex disamb="1"><base>substancja</base><ctag>NOUN</ctag></lex></tok><tok><orth>we</orth><lex disamb="1"><base>w</base><ctag>ADP</ctag></lex></tok><tok><orth>Wszechświecie</orth><lex disamb="1"><base>wszechświecie</base><ctag>PROPN</ctag></lex></tok><ns/><tok><orth>.</orth><lex disamb="1"><base>.</base><ctag>PUNCT</ctag></lex></tok></sentence></chunk><chunk><sentence><tok><orth>Woda</orth><lex disamb="1"><base>Wodo</base><ctag>NOUN</ctag></lex></tok><tok><orth>jest</orth><lex disamb="1"><base>jest</base><ctag>AUX</ctag></lex></tok><tok><orth>jedną</orth><lex disamb="1"><base>jeden</base><ctag>ADJ</ctag></lex></tok><tok><orth>z</orth><lex disamb="1"><base>z</base><ctag>ADP</ctag></lex></tok><tok><orth>najpospolitszych</orth><lex disamb="1"><base>pospolity</base><ctag>ADJ</ctag></lex></tok><tok><orth>substancji</orth><lex disamb="1"><base>substancja</base><ctag>NOUN</ctag></lex></tok><tok><orth>we</orth><lex disamb="1"><base>w</base><ctag>ADP</ctag></lex></tok><tok><orth>Wszechświecie</orth><lex disamb="1"><base>wszechświecie</base><ctag>PROPN</ctag></lex></tok><ns/><tok><orth>.</orth><lex disamb="1"><base>.</base><ctag>PUNCT</ctag></lex></tok></sentence><sentence><tok><orth>Woda</orth><lex disamb="1"><base>Wodo</base><ctag>NOUN</ctag></lex></tok><tok><orth>jest</orth><lex disamb="1"><base>jest</base><ctag>AUX</ctag></lex></tok><tok><orth>jedną</orth><lex disamb="1"><base>jeden</base><ctag>ADJ</ctag></lex></tok><tok><orth>z</orth><lex disamb="1"><base>z</base><ctag>ADP</ctag></lex></tok><tok><orth>najpospolitszych</orth><lex disamb="1"><base>pospolity</base><ctag>ADJ</ctag></lex></tok><tok><orth>substancji</orth><lex disamb="1"><base>substancja</base><ctag>NOUN</ctag></lex></tok><tok><orth>we</orth><lex disamb="1"><base>w</base><ctag>ADP</ctag></lex></tok><tok><orth>Wszechświecie</orth><lex disamb="1"><base>wszechświecie</base><ctag>PROPN</ctag></lex></tok><ns/><tok><orth>.</orth><lex disamb="1"><base>.</base><ctag>PUNCT</ctag></lex></tok></sentence></chunk></chunkList>',
    };
    const spyChunkList = jest.spyOn(
      ChunkListCreator.prototype,
      "createChunkList"
    );
    const testChunkList: ChunkList = [];
    spyChunkList.mockReturnValue(testChunkList);
    const spyAxios = jest.spyOn(axios, "get");
    spyAxios.mockResolvedValue(NERData);
    const resultHandle = "/test";
    await resultProcessor.processResult(resultHandle);

    expect(spyChunkList).toHaveBeenCalledTimes(1);
    expect(spyAxios).toHaveBeenCalledTimes(1);
    expect(spyAxios.mock.calls[0][0]).toBe(
      "https://ws.clarin-pl.eu/nlprest2/base/download" + resultHandle
    );
  });

  it("should try to hit proper APIUrls.RESULT URL and miss", async () => {
    const spyError = jest.spyOn(SimpleEventDispatcher.prototype, "dispatch");
    const spyAxios = jest.spyOn(axios, "get");
    spyAxios.mockRejectedValue(new Error("test"));
    const resultHandle = "/test";
    resultProcessor.processResult(resultHandle).then(
      (resolve) => {
        expect(resolve).toBeNull();
      },
      () => {
        expect(spyError).toHaveBeenCalledTimes(1);
      }
    );
  });
});
