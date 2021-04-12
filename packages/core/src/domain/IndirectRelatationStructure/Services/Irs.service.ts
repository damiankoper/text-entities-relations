import Container, { Service } from "typedi";
import { ChunkList } from "../../Ner/Models/ChunkList";

import { TextRangeUnit } from "../Constants";
import { EntityList } from "../Models/EntityList";
import { Entity } from "../Models/Entity";
import { EntityOccurence } from "../Models/EntityOccurence";
import { Relation } from "../Models/Relation";

@Service()
export class IrsService {
  private _entities: EntityList = [];
  private _document: ChunkList = [];

  static get(): IrsService {
    return Container.get(IrsService);
  }

  getRelationsInPeriod(
    startIndex: number,
    endIndex: number,
    unit: TextRangeUnit
  ): EntityList {
    const entityData: [Entity, Relation[]][] = this._entities.map((val) => [
      {
        id: val.id,
        name: val.name,
        relations: [],
      },
      val.relations,
    ]);

    let unitSelector: (val: Relation) => number;

    switch (unit) {
      case TextRangeUnit.CHUNK:
        unitSelector = (val) => val.chunkGlobalIndex;
        break;
      case TextRangeUnit.SENTENCE:
        unitSelector = (val) => val.sentenceGlobalIndex;
        break;
    }

    for (const [entity, relations] of entityData) {
      entity.relations = relations.filter(
        (val) =>
          unitSelector(val) >= startIndex && unitSelector(val) <= endIndex
      );
    }

    const entities = entityData.map(([entity]) => entity); //.filter((val) => val.relations.length);

    return entities;
  }

  loadDocument(doc: ChunkList): void {
    this._document = doc;
    this._entities = [];
  }

  calculateRelations(
    windowSize: number,
    overlap: number,
    unit: TextRangeUnit
  ): void {
    switch (unit) {
      case TextRangeUnit.CHUNK:
        const chunksLength = this._document.length;
        const offset = windowSize - overlap;

        let entityId = 1;
        const entities: Map<string, Entity> = new Map();

        for (let chunkIdx = 0; chunkIdx < chunksLength; chunkIdx += offset) {
          // over windows

          const entityOccurrences: EntityOccurence[] = [];
          const entitiesInWindow: Set<string> = new Set();

          for (let i = 0; i < windowSize; i++) {
            // over chunks

            if (chunkIdx + i >= chunksLength) break; // array bounds check

            const chunk = this._document[chunkIdx + i];

            for (const sentence of chunk.sentences) {
              for (const token of sentence.tokens) {
                if (!entities.has(token.name)) {
                  entities.set(token.name, {
                    id: entityId++,
                    name: token.name,
                    relations: [],
                  });
                }

                entitiesInWindow.add(token.name);

                entityOccurrences.push({
                  name: token.name,
                  chunkGlobalIndex: chunk.chunkIndex,
                  sentenceGlobalIndex: sentence.sentenceGlobalIndex,
                  tokenGlobalIndex: token.tokenGlobalIndex,
                });
              }
            }
          }

          // adding relations based on entityOccurrences
          for (const entityName of entitiesInWindow) {
            const entity = entities.get(entityName);
            if (!entity) continue; // TODO tu jakis error rzucać? choc nie powinno tak byc nigdy

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
        }

        this._entities = [...entities].map(([, value]) => value);

        break;

      case TextRangeUnit.SENTENCE:
        // TODO
        break;
      case TextRangeUnit.TOKEN:
        // TODO
        break;
    }
  }
}
