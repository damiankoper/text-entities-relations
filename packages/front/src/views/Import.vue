<template>
  <el-container direction="vertical">
    <Header />
    <el-main class="import">
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <h1 class="title">Import</h1>
        </el-col>
        <el-col :span="18">
          <el-row :gutter="12">
            <el-col :span="24" :lg="5" class="aside-bar">
              <el-steps
                :direction="'vertical'"
                :active="activeStep"
                style="height: 200px"
              >
                <el-step title="Dane wejściowe"></el-step>
                <el-step title="Parametry analizy"></el-step>
                <el-step title="Analiza"></el-step>
                <el-step title="Wizualizacja"></el-step>
              </el-steps>
            </el-col>
            <el-col :span="24" :lg="19">
              <ImportFile v-show="activeStep == 0" @submit="onFileSubmit" />
              <ImportParams
                v-show="activeStep == 1"
                @submit="onParamsSubmit"
                @back="activeStep--"
              />
              <ImportAnalyse
                v-if="activeStep == 2"
                :nerProgress="nerProgress"
                :terProgress="terProgress"
                :inProgress="inProgress"
                @back="activeStep--"
                @submit="onAnalyseSubmit"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
    <Footer />
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onUnmounted, onMounted } from "vue";
import ImportFile from "@/components/import/ImportFile.vue";
import ImportParams, { Params } from "@/components/import/ImportParams.vue";
import ImportAnalyse, { Progress } from "@/components/import/ImportAnalyse.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { ChunkList } from "core/lib/domain/Ner/Models/ChunkList";
import {
  NerInterfaceService,
  FileType,
  ErrorType,
  IrsService,
  Irs
} from "core";

const errorMsg = {
  [ErrorType.UPLOADING]: "Wystąpił błąd podczas wysyłania tesktu",
  [ErrorType.FETCHING]: "Wystąpił błąd podczas pobierania wyniku analizy",
  [ErrorType.TASK_STARTING]:
    "Wystąpił błąd podczas rozpoczynania przetwarzania",
  [ErrorType.PROCESSING]: "Wystąpił błąd podczas przetwarzania",
  [ErrorType.TASK_CHECKING]: "Wystąpił błąd podczas sprawdzania postepu"
};

export default defineComponent({
  emits: ["irs"],
  components: {
    ImportFile,
    ImportParams,
    ImportAnalyse,
    Header,
    Footer
  },
  setup(_, { emit }) {
    const activeStep = ref(0);
    const file = ref<File | null>(null);
    const fileType = ref<FileType>(FileType.DOCUMENT);
    const params = ref<Params | null>(null);

    const nerChunkList = ref<ChunkList>([]);
    const nerInterface = NerInterfaceService.get();

    const inProgress = ref(false);
    const nerProgress = reactive<Progress>({
      status: "",
      percentage: 0,
      error: null
    });
    const terProgress = reactive<Progress>({
      status: "",
      percentage: 0,
      error: null
    });
    const irs = ref<Irs | null>(null);
    const irsService = IrsService.getInstance();

    async function terAnalyse() {
      try {
        for (let i = 0; i < 10; i++) {
          terProgress.percentage += 10;
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        terProgress.status = "success";

        if (params.value == null)
          throw new Error("Cannot analyse with TER: parameters are null");

        irs.value = irsService.calculateRelations(
          nerChunkList.value,
          params.value.ter
        );
      } catch (error) {
        terProgress.status = "exception";
        terProgress.error = error;
      } finally {
        inProgress.value = false;
      }
    }

    let onProgressUnsub: () => void;
    let onSuccessUnsub: () => void;
    let onErrorUnsub: () => void;

    onMounted(() => {
      onProgressUnsub = nerInterface.onProgress.sub((progress: number) => {
        nerProgress.percentage = Math.round(progress * 10000) / 100;
      });
      onSuccessUnsub = nerInterface.onSuccess.sub((chunkList: ChunkList) => {
        nerChunkList.value = chunkList;
        nerProgress.status = "success";
        console.log("ChunkList", chunkList);

        terAnalyse();
      });
      onErrorUnsub = nerInterface.onError.sub((error: ErrorType) => {
        nerProgress.status = "exception";
        nerProgress.error = errorMsg[error];
        terProgress.status = "exception";
        inProgress.value = false;
      });
    });

    onUnmounted(() => {
      onProgressUnsub();
      onSuccessUnsub();
      onErrorUnsub();
    });

    return {
      activeStep,
      nerProgress,
      terProgress,
      inProgress,
      onFileSubmit(f: File) {
        file.value = f;
        if (file.value.name.endsWith(".zip")) {
          fileType.value = FileType.ARCHIVE;
        } else fileType.value = FileType.DOCUMENT;
        activeStep.value = 1;
      },
      async onParamsSubmit(p: Params) {
        params.value = p;
        activeStep.value = 2;
        inProgress.value = true;
        nerProgress.status = "";
        terProgress.status = "";
        nerProgress.percentage = 0;
        terProgress.percentage = 0;
        nerProgress.error = null;
        terProgress.error = null;

        if (file.value) {
          nerProgress.status = "";
          nerInterface.processFile(
            await file.value.arrayBuffer(),
            fileType.value,
            params.value.ner.lang
          );
        }
      },
      onAnalyseSubmit() {
        emit("irs", irs.value);
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.import {
  min-height: calc(100vh - 52px - 32px); // 100% - header - footer

  .title {
    text-align: left;
    font-size: 36px;
  }
}
</style>
