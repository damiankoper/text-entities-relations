import { APIUrls, baseURL, Status } from "../Constants";
import axios from "axios";
import { ChunkList } from "../Models/ChunkList";
import { ResultProcessor } from "./ResultProcessor.service";
import { Service } from "typedi";
import { NerEventDispatcher } from "./NerEventDispatcher.service";

@Service()
export class TaskObserver {
  private interval = 1000;

  constructor(
    private resultProcessor: ResultProcessor,
    private eventDispatcher: NerEventDispatcher
  ) {}

  private timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async observeTask(taskHandle: string): Promise<null> {
    const URL = baseURL + APIUrls.STATUS + taskHandle;
    let data;
    while (true) {
      try {
        const response = await axios.get(URL);
        data = response.data;
        if (data.status != Status.PROCESSING) break;
        this.eventDispatcher.dispatchProgress(data.value);
        await this.timeout(this.interval);
      } catch (error) {
        this.eventDispatcher.dispatchTaskCheckingError();
        throw null;
      }
    }
    if (data.status === Status.ERROR) {
      this.eventDispatcher.dispatchProcessingError();
      throw null;
    } else if (data.status === Status.DONE) {
      this.eventDispatcher.dispatchProgress(1);
      const result: ChunkList = [];
      this.resultProcessor.reset();
      for (const resultFile of data.value) {
        const resultHandle = resultFile["fileID"];
        try {
          const newResult = await this.resultProcessor.processResult(
            resultHandle
          );
          result.push(...newResult);
        } catch (error) {
          throw null;
        }
      }
      this.eventDispatcher.dispatchSuccess(result);
    }
    return null;
  }
}
