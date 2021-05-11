import { ChunkList } from "../../Ner/Models/ChunkList";
import { TokenType } from "../../Ner/Models/TokenType";
import { IrsSerializationService, IrsService } from ".";
import { TextUnit } from "../Models";

describe("IrsService", () => {
  it("should create irs structure from ner data", () => {
    const service = IrsService.get();
    const chunklist = createSampleChunklist();

    const irs = service.calculateRelations(chunklist, {
      window: 1,
      overlap: 0,
      unit: TextUnit.SENTENCE,
    });

    expect(
      irs.entities.find((e) => e.name === "Jonasz")?.relations.length
    ).toEqual(1);
    expect(
      irs.entities.find((e) => e.name === "Balwara")?.relations.length
    ).toEqual(2);
    expect(
      irs.entities.find((e) => e.name === "Międzyzdrój")?.relations.length
    ).toEqual(0);
    expect(
      irs.entities.find((e) => e.name === "Boczniak")?.relations.length
    ).toEqual(1);
  });

  it("should serialize its state to JSON and then restore it", () => {
    const irsService = IrsService.get();
    const serializationService = IrsSerializationService.get();
    const chunklist = createSampleChunklist();
    const irs = irsService.calculateRelations(chunklist, {
      window: 2,
      overlap: 1,
      unit: TextUnit.SENTENCE,
    });

    const json = serializationService.stringify(irs);
    const restored = serializationService.parse(json);
    expect(restored.entities.length).toEqual(4);
  });
});

function createSampleChunklist(): ChunkList {
  const chunklist: ChunkList = [
    {
      chunkIndex: 1,
      sentences: [
        {
          sentenceIndex: 1,
          sentenceGlobalIndex: 1,
          tokens: [
            {
              tokenIndex: 3,
              tokenGlobalIndex: 3,
              type: TokenType.PERSON,
              name: "Jonasz",
            },
          ],
        },
        {
          sentenceIndex: 2,
          sentenceGlobalIndex: 2,
          tokens: [
            {
              tokenIndex: 2,
              tokenGlobalIndex: 24,
              type: TokenType.PERSON,
              name: "Balwara",
            },
            {
              tokenIndex: 6,
              tokenGlobalIndex: 28,
              type: TokenType.PERSON,
              name: "Jonasz",
            },
          ],
        },
      ],
    },
    {
      chunkIndex: 2,
      sentences: [
        {
          sentenceIndex: 1,
          sentenceGlobalIndex: 3,
          tokens: [
            {
              tokenIndex: 17,
              tokenGlobalIndex: 78,
              type: TokenType.PERSON,
              name: "Międzyzdrój",
            },
          ],
        },
        {
          sentenceIndex: 2,
          sentenceGlobalIndex: 4,
          tokens: [
            {
              tokenIndex: 7,
              tokenGlobalIndex: 89,
              type: TokenType.PERSON,
              name: "Boczniak",
            },
            {
              tokenIndex: 22,
              tokenGlobalIndex: 104,
              type: TokenType.PERSON,
              name: "Balwara",
            },
          ],
        },
      ],
    },
  ];
  return chunklist;
}
