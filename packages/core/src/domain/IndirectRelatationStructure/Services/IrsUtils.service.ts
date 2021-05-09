import Container, { Service } from "typedi";
import { Entity, Irs, Position, Relation, TextUnit } from "../Models";

@Service()
export class IrsUtilsService {
  static get(): IrsUtilsService {
    return Container.get(IrsUtilsService);
  }

  getRelationsInPeriod(
    irs: Irs,
    startIndex: number,
    endIndex: number,
    unit: TextUnit
  ): Irs {
    const entityData = irs.entities.map(
      (val) =>
        [
          {
            name: val.name,
            relations: [],
          } as Entity,
          val.relations,
        ] as [Entity, Relation[]]
    );

    const unitSelector = this.getUnitSelector(unit);

    for (const [entity, relations] of entityData) {
      entity.relations = relations.filter(
        (val) =>
          unitSelector(val) >= startIndex && unitSelector(val) <= endIndex
      );
    }

    const entities = entityData.map(([entity]) => entity);

    return {
      document: irs.document,
      params: irs.params,
      entities: entities,
    };
  }

  deleteNode(irs: Irs, name: string): Irs {
    const entities = irs.entities
      .filter((e) => e.name !== name)
      .map(
        (e) =>
          ({
            name: e.name,
            relations: e.relations.filter((r) => r.target.name !== name),
          } as Entity)
      );

    return {
      document: irs.document,
      params: irs.params,
      entities: entities,
    };
  }

  mergeNodes(irs: Irs, joinedNames: string[], newName: string): Irs {
    // TODO mergeNodes

    return {
      document: irs.document,
      params: irs.params,
      entities: [],
    };
  }

  // TODO: extract this method to "helper" service used in IrsService and here
  private getUnitSelector(unit: TextUnit): (val: Position) => number {
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
