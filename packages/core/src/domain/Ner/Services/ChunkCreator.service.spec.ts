import { ChunkCreator } from "./ChunkCreator.service";
import { SentenceCreator } from "./SentenceCreator.service";
import { Sentence } from "../Models/Sentence";
import { TokenCreator } from "./TokenCreator.service";
import { Token } from "../Models/Token";
import { TokenType } from "../Models/TokenType";
jest.mock("./SentenceCreator.service");

describe("ChunkCreator", () => {
  const mockSentenceCreator = new SentenceCreator(
    {} as TokenCreator
  ) as jest.Mocked<SentenceCreator>;
  const chunkCreator = new ChunkCreator(mockSentenceCreator);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    chunkCreator.reset();
  });

  it("should create one chunk", () => {
    const testToken: Token = {
      tokenIndex: 0,
      tokenGlobalIndex: 0,
      name: "test",
      type: TokenType.PERSON,
    };
    const testSentence: Sentence = {
      tokens: [testToken],
      sentenceGlobalIndex: 0,
      sentenceIndex: 0,
    };
    mockSentenceCreator.createSentence.mockReturnValue(testSentence);
    const chunk = {
      sentence: [
        {
          tok: [
            {
              orth: ["Harry"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
            {
              orth: ["Potter"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
          ],
          ns: [],
        },
        {
          tok: [
            {
              orth: ["Harry"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
            {
              orth: ["Potter"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
          ],
          ns: [],
        },
      ],
    };
    const newChunk = chunkCreator.createChunk(chunk);

    expect(newChunk.chunkIndex).toBe(0);
    expect(mockSentenceCreator.createSentence).toHaveBeenCalledTimes(2);
  });

  it("should create two chunks", () => {
    const testToken: Token = {
      tokenIndex: 0,
      tokenGlobalIndex: 0,
      name: "test",
      type: TokenType.PERSON,
    };
    const testSentence: Sentence = {
      tokens: [testToken],
      sentenceGlobalIndex: 0,
      sentenceIndex: 0,
    };
    mockSentenceCreator.createSentence.mockReturnValue(testSentence);
    const chunk = {
      sentence: [
        {
          tok: [
            {
              orth: ["Harry"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
            {
              orth: ["Potter"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
          ],
          ns: [],
        },
        {
          tok: [
            {
              orth: ["Harry"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
            {
              orth: ["Potter"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
          ],
          ns: [],
        },
      ],
    };

    chunkCreator.createChunk(chunk);
    const newChunk = chunkCreator.createChunk(chunk);

    expect(newChunk.chunkIndex).toBe(1);
    expect(mockSentenceCreator.createSentence).toHaveBeenCalledTimes(4);
  });

  it("should create chunk with one sentence because the other is empty", () => {
    const testToken: Token = {
      tokenIndex: 0,
      tokenGlobalIndex: 0,
      name: "test",
      type: TokenType.PERSON,
    };
    const testSentence: Sentence = {
      tokens: [testToken],
      sentenceGlobalIndex: 0,
      sentenceIndex: 0,
    };
    const testSentenceEmpty: Sentence = {
      tokens: [],
      sentenceGlobalIndex: 0,
      sentenceIndex: 0,
    };
    mockSentenceCreator.createSentence
      .mockReturnValueOnce(testSentenceEmpty)
      .mockReturnValue(testSentence);
    const chunk = {
      sentence: [
        {
          tok: [
            {
              orth: ["Harry"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
            {
              orth: ["Potter"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
          ],
          ns: [],
        },
        {
          tok: [
            {
              orth: ["Harry"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
            {
              orth: ["Potter"],
              lex: [{ base: ["harry"], ctag: ["PRON"], $: { disamb: "1" } }],
              ann: [],
            },
          ],
          ns: [],
        },
      ],
    };
    const newChunk = chunkCreator.createChunk(chunk);

    expect(newChunk.sentences.length).toBe(1);
  });
});
