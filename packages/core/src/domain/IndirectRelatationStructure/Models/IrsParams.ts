import { TokenType } from "../../Ner/Models/TokenType";
import { TextUnit } from "../Models";

export interface IrsParams {
  window: number;
  overlap: number;
  unit: TextUnit;
  types: TokenType[];
  post: {
    minRelations: number;
    maxMergeDistance: number;
    excludeNumbers: boolean;
  };
}

export const defaultIrsParams = (): IrsParams => ({
  window: 1,
  overlap: 0,
  unit: TextUnit.SENTENCE,
  types: Object.values(TokenType).filter((t) => t != TokenType.DATE),
  post: { minRelations: 0, maxMergeDistance: 0, excludeNumbers: false },
});
