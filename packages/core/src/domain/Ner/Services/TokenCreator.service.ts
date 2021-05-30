import { Token } from "../Models/Token";
import { Sentence } from "../Models/Sentence";
import { XMLToken } from "../Constants";
import { Service } from "typedi";
import {
  TokenType,
  TokenTypeEnglish,
  TokenTypeRest,
} from "../Models/TokenType";

@Service()
export class TokenCreator {
  private tokenGlobalCounter = 0;

  public createToken(
    tokenInSentenceCounter: number,
    sentence: Sentence,
    lastAnnotation: string,
    token: XMLToken
  ): string {
    this.tokenGlobalCounter++;
    if (token.hasOwnProperty("ann")) {
      for (const annotation of token.ann) {
        if (annotation._ !== "0") {
          const type = this.getTokenType(annotation.$.chan);
          const name = token.lex[0].base[0];
          const lastToken = sentence.tokens.slice(-1)[0];
          if (
            lastToken &&
            annotation._ === lastAnnotation &&
            type === lastToken.type
          ) {
            const lastToken = sentence.tokens.pop() as Token;
            lastToken.name = lastToken.name + " " + name;
            sentence.tokens.push(lastToken);
          } else {
            const newToken: Token = {
              tokenIndex: tokenInSentenceCounter,
              tokenGlobalIndex: this.tokenGlobalCounter - 1,
              name: name,
              type: type,
            };
            sentence.tokens.push(newToken);
          }
          return annotation._;
        }
      }
    }
    return "0";
  }

  public reset(): void {
    this.tokenGlobalCounter = 0;
  }

  private getTokenType(type: string): TokenType {
    switch (type) {
      case TokenType.ORGANIZATION:
      case TokenTypeEnglish.ORGANIZATION:
      case TokenTypeRest.ORGANIZATION:
        return TokenType.ORGANIZATION;
      case TokenType.DATE:
      case TokenTypeEnglish.DATE:
      case TokenTypeEnglish.TIME:
        return TokenType.DATE;
      case TokenType.LOCATION:
      case TokenTypeEnglish.LOCATION:
      case TokenTypeEnglish.GPE:
      case TokenTypeRest.LOCATION:
        return TokenType.LOCATION;
      case TokenType.PERSON:
      case TokenTypeEnglish.PERSON:
      case TokenTypeRest.PERSON:
        return TokenType.PERSON;
      case TokenType.PLACE:
        return TokenType.PLACE;
      case TokenType.NUMBER:
      case TokenTypeEnglish.ORDINAL:
      case TokenTypeEnglish.CARDINAL:
      case TokenTypeEnglish.QUANTITY:
        return TokenType.NUMBER;
      case TokenType.ART:
      case TokenTypeEnglish.ART:
        return TokenType.ART;
      case TokenTypeEnglish.NORP:
      case TokenType.NORP:
        return TokenType.NORP;
      case TokenType.MISCELLANEOUS:
      case TokenTypeRest.MISCELLANEOUS:
        return TokenType.MISCELLANEOUS;
      default:
        return TokenType.MISCELLANEOUS;
    }
  }
}
