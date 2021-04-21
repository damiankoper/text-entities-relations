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
                <el-step title="Ustaw parametry"></el-step>
                <el-step title="Analiza"></el-step>
                <el-step title="Wizualizacja"></el-step>
              </el-steps>
            </el-col>
            <el-col :span="24" :lg="19">
              <ImportFile v-if="activeStep == 0" @submit="onFileSubmit" />
              <ImportParams
                v-if="activeStep == 1"
                @submit="onParamsSubmit"
                @back="activeStep--"
              />
              <ImportAnalyse
                v-if="activeStep == 2"
                :nerProgress="nerProgress"
                :terProgress="terProgress"
                :inProgress="nerInProgress"
                :error="error"
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

<style lang="scss" scoped>
.import {
  min-height: calc(100vh - 52px - 32px); // 100% - header - footer

  .title {
    text-align: left;
    font-size: 36px;
  }
  .el-col {
    margin-bottom: 24px;
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, reactive, onUnmounted } from "vue";
import ImportFile from "@/components/import/ImportFile.vue";
import ImportParams, { Params } from "@/components/import/ImportParams.vue";
import ImportAnalyse, { Progress } from "@/components/import/ImportAnalyse.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useRouter } from "vue-router";
import { ChunkList } from "core/lib/domain/Ner/Models/ChunkList";
import { NerInterfaceService } from "core";

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
    const params = ref<Params | null>(null);
    const { push } = useRouter();

    const nerChunkList = ref<ChunkList>([]);
    const nerInterface = NerInterfaceService.get();
    const onProgressUnsub = nerInterface.onProgress.sub((progress: number) => {
      console.log(progress);
    });
    const onSuccessUnsub = nerInterface.onSuccess.sub(
      (chunkList: ChunkList) => {
        nerChunkList.value = chunkList;
        console.log(chunkList);
      }
    );
    onUnmounted(() => {
      onProgressUnsub();
      onSuccessUnsub();
    });

    const nerProgress = reactive<Progress>({ status: "", percentage: 25 });
    const terProgress = reactive<Progress>({ status: "", percentage: 0 });
    const nerInProgress = ref(false);
    const error = ref<string | null>(null);

    const irs = ref("irs_structure_here");

    return {
      activeStep,
      nerProgress,
      terProgress,
      nerInProgress,
      error,
      onFileSubmit(f: File) {
        file.value = f;
        activeStep.value = 1;
      },
      async onParamsSubmit(p: Params) {
        params.value = p;
        activeStep.value = 2;
        // MUI IMPORTANTE
        // entrypoint for NerInterface here
        if (file.value) {
          nerInterface.processFile(
            file.value as any,
            "file" as any, // TODO: enum
            "pl" as any
          );
          //irs.value = "returned from NerInterface after analyse";
        }
      },
      onAnalyseSubmit() {
        emit("irs", irs.value);
        push("graph");
      }
    };
  }
});
</script>
