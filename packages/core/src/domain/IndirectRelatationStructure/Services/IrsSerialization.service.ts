import Container, { Service } from "typedi";
import { parse, stringify } from "flatted";
import { Irs } from "../Models";

@Service()
export class IrsSerializationService {
  static getInstance(): IrsSerializationService {
    return Container.get(IrsSerializationService);
  }

  stringify(state: Irs): string {
    return stringify(state);
  }

  parse(irsState: string): Irs {
    return parse(irsState) as Irs;
  }
}
