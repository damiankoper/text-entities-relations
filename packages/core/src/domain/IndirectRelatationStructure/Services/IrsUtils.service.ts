import Container, { Service } from "typedi";
import { Entity, Irs, Relation, TextUnit } from "../Models";
import { IrsHelperService } from "./IrsHelper.service";

@Service()
export class IrsUtilsService {
  constructor(private helperService: IrsHelperService) {}

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

    const unitSelector = this.helperService.getUnitSelector(unit);

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
}
