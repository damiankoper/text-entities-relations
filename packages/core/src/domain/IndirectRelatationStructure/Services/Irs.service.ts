import Container, { Service } from "typedi";
import { ChunkList } from "../../Ner/Models/ChunkList";

import {
  Entity,
  EntityOccurrence,
  IrsParams,
  Irs,
  Position,
  Relation,
  TextRangeUnit,
} from "../Models";

@Service()
export class IrsService {
  static getInstance(): IrsService {
    return Container.get(IrsService);
  }

  calculateRelations(document: ChunkList, params: IrsParams): Irs {
    const offset = params.window - params.overlap;

    if (offset <= 0)
      throw new Error("Overlap should be lower than window size");

    const [entities, entityOccurrences, maxIdx] = this.extractEntities(
      document,
      params.unit
    );
    const unitSelector = this.getUnitSelector(params.unit);

    for (let idx = 0; idx <= maxIdx; idx += offset) {
      const occurrencesInWindow = entityOccurrences.filter(
        (t) => unitSelector(t) >= idx && unitSelector(t) < idx + params.window
      );

      const entitiesInWindow = new Set(
        occurrencesInWindow.map((val) => val.name)
      );

      entitiesInWindow.forEach((entityName) =>
        this.addNewRelations(entityName, entities, occurrencesInWindow)
      );
    }

    return {
      document: document,
      params: params,
      entities: [...entities].map(([, value]) => value),
    };
  }

  private getUnitSelector(unit: TextRangeUnit): (val: Position) => number {
    switch (unit) {
      case TextRangeUnit.CHUNK:
        return (val) => val.chunkGlobalIndex;
      case TextRangeUnit.SENTENCE:
        return (val) => val.sentenceGlobalIndex;
      case TextRangeUnit.WORD:
        return (val) => val.tokenGlobalIndex;
    }
  }

  private addNewRelations(
    entityName: string,
    entities: Map<string, Entity>,
    entityOccurrences: EntityOccurrence[]
  ): void {
    const entity = entities.get(entityName);
    if (!entity) throw new Error(`Entity ${entityName} not found in map`);

    const existingRelationsTokenIndexes = new Set(
      entity.relations.map((val) => val.tokenGlobalIndex)
    );

    const newRelations: Relation[] = entityOccurrences
      .filter(
        (val) =>
          val.name !== entityName &&
          !existingRelationsTokenIndexes.has(val.tokenGlobalIndex)
      )
      .map(
        (val) =>
          ({
            target: entities.get(val.name),
            chunkGlobalIndex: val.chunkGlobalIndex,
            sentenceGlobalIndex: val.sentenceGlobalIndex,
            tokenGlobalIndex: val.tokenGlobalIndex,
          } as Relation)
      );

    entity.relations.push(...newRelations);
  }

  private extractEntities(
    document: ChunkList,
    unit: TextRangeUnit
  ): [Map<string, Entity>, EntityOccurrence[], number] {
    const entities: Map<string, Entity> = new Map();
    const entityOccurrences: EntityOccurrence[] = [];
    const unitSelector = this.getUnitSelector(unit);
    let maxIndex = 0;

    document.forEach((chunk) => {
      chunk.sentences.forEach((sentence) => {
        const occurrences = sentence.tokens.map((token) => {
          if (!entities.has(token.name)) {
            entities.set(token.name, {
              name: token.name,
              relations: [],
            });
          }

          const occurence = {
            name: token.name,
            chunkGlobalIndex: chunk.chunkIndex,
            sentenceGlobalIndex: sentence.sentenceGlobalIndex,
            tokenGlobalIndex: token.tokenGlobalIndex,
          } as EntityOccurrence;

          if (unitSelector(occurence) > maxIndex) {
            maxIndex = unitSelector(occurence);
          }

          return occurence;
        });

        entityOccurrences.push(...occurrences);
      });
    });

    return [entities, entityOccurrences, maxIndex];
  }
}
