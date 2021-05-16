import _ from "lodash";
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

  mergeNodes(irs: Irs, mergedNames: string[], newName?: string): Irs {
    const mergedNodeName = newName ? newName : mergedNames[0];

    const mergedNodes = irs.entities.filter((e) =>
      mergedNames.includes(e.name)
    );

    const newNode = {
      name: mergedNodeName,
      relations: [],
    } as Entity;

    const notMergedNodes: Map<string, Entity> = new Map(
      irs.entities
        .filter((e) => !mergedNames.includes(e.name))
        .map((e) => [
          e.name,
          {
            name: e.name,
            relations: e.relations.map((r) => {
              if (mergedNames.includes(r.target.name)) {
                return {
                  ...r,
                  target: newNode,
                };
              }
              return r;
            }),
          },
        ])
    );

    newNode.relations = _.uniqWith(
      mergedNodes
        .map((e) =>
          e.relations
            .filter((r) => !mergedNames.includes(r.target.name))
            .map(
              (r) =>
                ({
                  ...r,
                  target: notMergedNodes.get(r.target.name),
                } as Relation)
            )
        )
        .flat(),
      (a, b) =>
        a.target.name === b.target.name &&
        a.tokenGlobalIndex === b.tokenGlobalIndex
    );

    return {
      document: irs.document,
      params: irs.params,
      entities: [newNode, ...[...notMergedNodes].map(([, v]) => v)],
    };
  }
}
