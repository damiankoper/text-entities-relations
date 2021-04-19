import Container, { Service } from "typedi";
import { ChunkList } from "../../Ner/Models/ChunkList";

import { TextRangeUnit } from "../Constants";
import { EntityList } from "../Models/EntityList";
import { Entity } from "../Models/Entity";
import { EntityOccurrence } from "../Models/EntityOccurrence";
import { Relation } from "../Models/Relation";
import { Position } from "../Models/Position";

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
        name: val.name,
        relations: [],
      },
      val.relations,
    ]);

    const unitSelector = this.getUnitSelector(unit);

    for (const [entity, relations] of entityData) {
      entity.relations = relations.filter(
        (val) =>
          unitSelector(val) >= startIndex && unitSelector(val) <= endIndex
      );
    }

    const entities = entityData.map(([entity]) => entity);

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
    const offset = windowSize - overlap;
    const [entities, entityOccurrences, maxIdx] = this.extractEntities(unit);
    const unitSelector = this.getUnitSelector(unit);

    for (let idx = 0; idx < maxIdx; idx += offset) {
      const occurrencesInWindow = entityOccurrences.filter(
        (t) => unitSelector(t) >= idx && unitSelector(t) < idx + windowSize
      );

      const entitiesInWindow = new Set(
        occurrencesInWindow.map((val) => val.name)
      );

      entitiesInWindow.forEach((entityName) =>
        this.addNewRelations(entityName, entities, entityOccurrences)
      );
    }

    this._entities = [...entities].map(([, value]) => value);
  }

  private getUnitSelector(unit: TextRangeUnit): (val: Position) => number {
    switch (unit) {
      case TextRangeUnit.CHUNK:
        return (val) => val.chunkGlobalIndex;
      case TextRangeUnit.SENTENCE:
        return (val) => val.sentenceGlobalIndex;
      case TextRangeUnit.TOKEN:
        return (val) => val.tokenGlobalIndex;
    }
  }

  private addNewRelations(
    entityName: string,
    entities: Map<string, Entity>,
    entityOccurrences: EntityOccurrence[]
  ): void {
    const entity = entities.get(entityName);
    if (!entity)
      throw new Error("Entity '" + entityName + "' not found in map");

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
    unit: TextRangeUnit
  ): [Map<string, Entity>, EntityOccurrence[], number] {
    const entities: Map<string, Entity> = new Map();
    const entityOccurrences: EntityOccurrence[] = [];
    const unitSelector = this.getUnitSelector(unit);
    let maxIndex = 0;

    this._document.forEach((chunk) => {
      chunk.sentences.forEach((sentence) => {
        const occurrences = sentence.tokens.map((token) => {
          if (!entities.has(name)) {
            entities.set(name, {
              name: name,
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
