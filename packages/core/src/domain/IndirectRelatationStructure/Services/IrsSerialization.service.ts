import Container, { Service } from "typedi";
import { parse, stringify } from "flatted";
import { Irs } from "../Models";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";
@Service()
export class IrsSerializationService {
  static get(): IrsSerializationService {
    return Container.get(IrsSerializationService);
  }

  stringify(state: Irs): string {
    return compressToUTF16(stringify(state));
  }

  parse(irsState: string): Irs {
    return parse(decompressFromUTF16(irsState) as string) as Irs;
  }
}
