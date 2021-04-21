import { APIUrls, baseURL } from "../Constants";
import axios from "axios";
import { ChunkListCreator } from "./ChunkListCreator.service";
import { ChunkList } from "../Models/ChunkList";
import { Service } from "typedi";
import { NerEventDispatcher } from "./NerEventDispatcher.service";

@Service()
export class ResultProcessor {
  constructor(
    private chunkListCreator: ChunkListCreator,
    private eventDispatcher: NerEventDispatcher
  ) {}

  public async processResult(resultHandle: string): Promise<ChunkList> {
    const URL = baseURL + APIUrls.RESULT + resultHandle;
    try {
      const response = await axios.get(URL);
      const NERData = response.data;
      const result = this.chunkListCreator.createChunkList(NERData);
      return result;
    } catch (error) {
      this.eventDispatcher.dispatchFetchingError();
      throw [];
    }
  }

  public reset(): void {
    this.chunkListCreator.reset();
  }
}
