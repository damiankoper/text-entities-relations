import { Service } from "typedi";
import { Position, TextUnit } from "../Models";

@Service()
export class IrsHelperService {
  getUnitSelector(unit: TextUnit): (val: Position) => number {
    switch (unit) {
      case TextUnit.CHUNK:
        return (val) => val.chunkGlobalIndex;
      case TextUnit.SENTENCE:
        return (val) => val.sentenceGlobalIndex;
      case TextUnit.WORD:
        return (val) => val.tokenGlobalIndex;
    }
  }
}
