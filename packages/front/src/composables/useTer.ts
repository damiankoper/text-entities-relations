import { ChunkList, Irs, IrsParams, IrsService } from "core";
import { ref } from "vue";
import { Progress, defaultProgress } from "@/common/constants";

export function useTer() {
  const irsService = IrsService.get();
  const irs = ref<Irs | null>(null);
  const progress = ref<Progress>(defaultProgress());

  return {
    irs,
    progress,
    resetProgress() {
      progress.value = defaultProgress();
    },
    async analyse(chunkList: ChunkList, params: IrsParams) {
      try {
        progress.value.inProgress = true;
        if (params == null) {
          throw new Error("Cannot analyse with TER: parameters are null");
        }
        irs.value = irsService.calculateRelations(chunkList, params);

        progress.value.percentage = 100;
        progress.value.status = "success";
      } catch (error) {
        progress.value.status = "exception";
        progress.value.error = error;
      } finally {
        progress.value.inProgress = false;
      }
    }
  };
}
