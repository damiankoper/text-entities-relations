import { APIUrls, baseURL } from "../Constants";
import axios from "axios";
import { TaskHandler } from "./TaskHandler.service";
import { Service } from "typedi";
import { NerEventDispatcher } from "./NerEventDispatcher.service";
import { FileType } from "../Models/FileType";
import { Language } from "../Models/Language";

@Service()
export class FileProcessor {
  private headers = {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  };

  constructor(
    private taskHandler: TaskHandler,
    private eventDispatcher: NerEventDispatcher
  ) {}

  public async process(
    file: ArrayBuffer,
    fileType: FileType,
    language: Language
  ): Promise<null> {
    const URL = baseURL + APIUrls.UPLOAD;
    try {
      const response = await axios.post(URL, file, this.headers);
      const fileHandle = response.data;
      try {
        if (fileType == FileType.ARCHIVE)
          await this.taskHandler.startTaskArchive(fileHandle, language);
        else await this.taskHandler.startTaskDocument(fileHandle, language);
        return null;
      } catch {
        throw null;
      }
    } catch (error) {
      this.eventDispatcher.dispatchUploadingError();
      throw null;
    }
  }
}
