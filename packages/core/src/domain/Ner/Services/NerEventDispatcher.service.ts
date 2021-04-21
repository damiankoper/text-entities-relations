import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { ChunkList } from "../Models/ChunkList";
import { Service } from "typedi";
import { Errors } from "../Models/Errors";

@Service()
export class NerEventDispatcher {
  private _onError = new SimpleEventDispatcher<string>();
  private _onProgress = new SimpleEventDispatcher<number>();
  private _onSuccess = new SimpleEventDispatcher<ChunkList>();

  get onError(): ISimpleEvent<string> {
    return this._onError.asEvent();
  }

  get onProgress(): ISimpleEvent<number> {
    return this._onProgress.asEvent();
  }

  get onSuccess(): ISimpleEvent<ChunkList> {
    return this._onSuccess.asEvent();
  }

  private dispatchError(message: string): void {
    this._onError.dispatch(message);
  }

  public dispatchUploadingError(): void {
    this.dispatchError(Errors.UPLOADING);
  }

  public dispatchFetchingError(): void {
    this.dispatchError(Errors.FETCHING);
  }

  public dispatchTaskStartingError(): void {
    this.dispatchError(Errors.TASK_STARTING);
  }

  public dispatchProcessingError(): void {
    this.dispatchError(Errors.PROCESSING);
  }

  public dispatchTaskCheckingError(): void {
    this.dispatchError(Errors.TASK_CHECKING);
  }

  public dispatchProgress(num: number): void {
    this._onProgress.dispatch(num);
  }

  public dispatchSuccess(chunkList: ChunkList): void {
    this._onSuccess.dispatch(chunkList);
  }
}
