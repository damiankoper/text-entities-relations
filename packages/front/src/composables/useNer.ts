import { ChunkList, ErrorType, FileType, NerInterfaceService } from "core";
import { onMounted, onUnmounted, ref } from "vue";
import { Progress, defaultProgress } from "@/common/constants";
import { NerParams } from "@/common/constants";

const errorMsg = {
  [ErrorType.UPLOADING]: "Wystąpił błąd podczas wysyłania tesktu",
  [ErrorType.FETCHING]: "Wystąpił błąd podczas pobierania wyniku analizy",
  [ErrorType.TASK_STARTING]:
    "Wystąpił błąd podczas rozpoczynania przetwarzania",
  [ErrorType.PROCESSING]: "Wystąpił błąd podczas przetwarzania",
  [ErrorType.TASK_CHECKING]: "Wystąpił błąd podczas sprawdzania postepu"
};

export function useNer() {
  const chunkList = ref<ChunkList>([]);
  const nerInterface = NerInterfaceService.get();
  const progress = ref<Progress>(defaultProgress());

  let onProgressUnsub: () => void;
  let onSuccessUnsub: () => void;
  let onErrorUnsub: () => void;

  onMounted(() => {
    onProgressUnsub = nerInterface.onProgress.sub((p: number) => {
      progress.value.percentage = Math.round(p * 10000) / 100;
    });
    onSuccessUnsub = nerInterface.onSuccess.sub((c: ChunkList) => {
      chunkList.value = c;
      progress.value.status = "success";
    });
    onErrorUnsub = nerInterface.onError.sub((error: ErrorType) => {
      progress.value.status = "exception";
      progress.value.error = errorMsg[error];
      progress.value.inProgress = false;
    });
  });

  onUnmounted(() => {
    onProgressUnsub();
    onSuccessUnsub();
    onErrorUnsub();
  });

  return {
    chunkList,
    progress,
    resetProgress() {
      progress.value = defaultProgress();
    },
    async analyse(file: File, fileType: FileType, params: NerParams) {
      let onSuccessLocal: () => void = () => undefined;
      try {
        progress.value.inProgress = true;

        nerInterface.processFile(
          await file.arrayBuffer(),
          fileType,
          params.lang
        );

        await new Promise(
          resolve => (onSuccessLocal = nerInterface.onSuccess.one(resolve))
        );
        progress.value.status = "success";
      } catch (error) {
        progress.value.status = "exception";
        progress.value.error = error;
      } finally {
        progress.value.inProgress = false;
        if (onSuccessLocal) onSuccessLocal();
      }
    }
  };
}
