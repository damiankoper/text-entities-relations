import Container, { Service } from "typedi";
import { ChunkList } from "../../Ner";
import { IrsHelperService } from "./IrsHelper.service";
import { Entity, EntityOccurrence, IrsParams, Irs, Relation } from "../Models";
import { IrsUtilsService } from "./IrsUtils.service";
import levenshtein from "fast-levenshtein";

@Service()
export class IrsService {
  constructor(
    private helperService: IrsHelperService,
    private utilsService: IrsUtilsService
  ) {}

  static get(): IrsService {
    return Container.get(IrsService);
  }

  calculateRelations(document: ChunkList, params: IrsParams): Irs {
    const offset = params.window - params.overlap;

    if (offset <= 0)
      throw new Error("Overlap should be lower than window size");

    const { entities, entityOccurrences, maxIdx } = this.extractEntities(
      document,
      params
    );
    const unitSelector = this.helperService.getUnitSelector(params.unit);

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

    const irs = {
      document: document,
      params: params,
      entities: [...entities.values()],
    };

    return this.postIrs(irs, params);
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
    { unit, types }: IrsParams
  ): {
    entities: Map<string, Entity>;
    entityOccurrences: EntityOccurrence[];
    maxIdx: number;
  } {
    const entities: Map<string, Entity> = new Map();
    const entityOccurrences: EntityOccurrence[] = [];
    const unitSelector = this.helperService.getUnitSelector(unit);
    let maxIdx = 0;

    document.forEach((chunk) => {
      chunk.sentences.forEach((sentence) => {
        const tokens = sentence.tokens.filter((t) => types.includes(t.type));

        const occurrences = tokens.map((token) => {
          if (!entities.has(token.name)) {
            entities.set(token.name, {
              name: token.name,
              type: token.type,
              relations: [],
            });
          }

          const occurence: EntityOccurrence = {
            name: token.name,
            chunkGlobalIndex: chunk.chunkIndex,
            sentenceGlobalIndex: sentence.sentenceGlobalIndex,
            tokenGlobalIndex: token.tokenGlobalIndex,
          };

          if (unitSelector(occurence) > maxIdx) {
            maxIdx = unitSelector(occurence);
          }

          return occurence;
        });

        entityOccurrences.push(...occurrences);
      });
    });

    return { entities, entityOccurrences, maxIdx };
  }

  private postIrs(irs: Irs, params: IrsParams): Irs {
    // Delete numbers
    if (params.post.excludeNumbers) {
      for (const entity of irs.entities) {
        if (!isNaN(Number(entity.name))) {
          irs = this.utilsService.deleteNode(irs, entity.name);
        }
      }
    }

    // Merge
    for (let i = 0; i < irs.entities.length; i++) {
      const iName = irs.entities[i].name;
      const toMerge: string[] = [iName];
      for (let j = i + 1; j < irs.entities.length; j++) {
        const jName = irs.entities[j].name;
        if (levenshtein.get(iName, jName) <= params.post.maxMergeDistance) {
          toMerge.push(jName);
        }
      }
      if (toMerge.length > 1) {
        irs = this.utilsService.mergeNodes(irs, toMerge);
      }
    }

    // Delete
    const toDelete: string[] = [];
    for (const entity of irs.entities) {
      if (entity.relations.length < params.post.minRelations) {
        toDelete.push(entity.name);
      }
    }

    toDelete.forEach((d) => {
      irs = this.utilsService.deleteNode(irs, d);
    });
    return irs;
  }
}
