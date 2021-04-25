import Container, { Service } from "typedi";
import { ISimpleEvent } from "strongly-typed-events";
import { ChunkList } from "../Models/ChunkList";
import { FileProcessor } from "./FileProcessor.service";
import { NerEventDispatcher } from "./NerEventDispatcher.service";
import { Language } from "../Models/Language";
import { FileType } from "../Models/FileType";

/**
 * Responsible for sending and obtaining results of NER processing.
 * Fetches and emits progress events.
 */
@Service()
export class NerInterfaceService {
  constructor(
    private fileProcessor: FileProcessor,
    private eventDispatcher: NerEventDispatcher
  ) {}

  get onProgress(): ISimpleEvent<number> {
    return this.eventDispatcher.onProgress;
  }

  get onSuccess(): ISimpleEvent<ChunkList> {
    return this.eventDispatcher.onSuccess;
  }

  get onError(): ISimpleEvent<string> {
    return this.eventDispatcher.onError;
  }

  static get(): NerInterfaceService {
    return Container.get(NerInterfaceService);
  }

  public async processFile(
    file: ArrayBuffer,
    fileType: FileType,
    language: Language
  ): Promise<void> {
    await this.fileProcessor.process(file, fileType, language);
  }
}
