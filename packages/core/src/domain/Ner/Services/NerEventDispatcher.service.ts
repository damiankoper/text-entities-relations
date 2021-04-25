import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { ChunkList } from "../Models/ChunkList";
import { Service } from "typedi";
import { ErrorType } from "../Models/ErrorType";

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
    this.dispatchError(ErrorType.UPLOADING);
  }

  public dispatchFetchingError(): void {
    this.dispatchError(ErrorType.FETCHING);
  }

  public dispatchTaskStartingError(): void {
    this.dispatchError(ErrorType.TASK_STARTING);
  }

  public dispatchProcessingError(): void {
    this.dispatchError(ErrorType.PROCESSING);
  }

  public dispatchTaskCheckingError(): void {
    this.dispatchError(ErrorType.TASK_CHECKING);
  }

  public dispatchProgress(num: number): void {
    this._onProgress.dispatch(num);
  }

  public dispatchSuccess(chunkList: ChunkList): void {
    this._onSuccess.dispatch(chunkList);
  }
}
