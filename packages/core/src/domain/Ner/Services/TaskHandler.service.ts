import { APIUrls, baseURL } from "../Constants";
import axios from "axios";
import { TaskObserver } from "./TaskObserver.service";
import { Service } from "typedi";
import { NerEventDispatcher } from "./NerEventDispatcher.service";
import { Language } from "../Models/Language";

@Service()
export class TaskHandler {
  private headers = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  private user = "Grupa D";

  constructor(
    private taskObserver: TaskObserver,
    private eventDispatcher: NerEventDispatcher
  ) {}

  public async startTaskArchive(
    fileHandle: string,
    language: Language
  ): Promise<void> {
    const data = {
      lpmn: this.getLPMNForLanguageArchive(fileHandle, language),
      user: this.user,
    };
    return this.sendRequest(data);
  }

  public async startTaskDocument(
    fileHandle: string,
    language: Language
  ): Promise<void> {
    const data = {
      lpmn: this.getLPMNForLanguage(language),
      file: fileHandle,
      user: this.user,
    };
    return this.sendRequest(data);
  }

  private async sendRequest(data: Record<string, unknown>): Promise<void> {
    const URL = baseURL + APIUrls.START;
    try {
      const response = await axios.post(URL, data, this.headers);
      const taskHandle = response.data;
      await this.taskObserver.observeTask(taskHandle);
    } catch (error) {
      this.eventDispatcher.dispatchTaskStartingError();
      throw error;
    }
  }

  private getLPMNForLanguage(language: Language): string {
    return 'any2txt|spacy({"method":"ner","lang":"' + language + '"})';
  }

  private getLPMNForLanguageArchive(
    fileHandle: string,
    language: Language
  ): string {
    return "filezip(" + fileHandle + ")|" + this.getLPMNForLanguage(language);
  }
}
