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
import { defineComponent, ref } from "vue";
import ImportFile from "@/components/import/ImportFile.vue";
import ImportParams, { Params } from "@/components/import/ImportParams.vue";
import ImportAnalyse from "@/components/import/ImportAnalyse.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useNer } from "@/composables/useNer";
import { useTer } from "@/composables/useTer";
import { FileType } from "core";

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

    const {
      progress: nerProgress,
      resetProgress: resetNerProgress,
      analyse: nerAnalyse,
      chunkList
    } = useNer();
    const {
      progress: terProgress,
      resetProgress: resetTerProgress,
      analyse: terAnalyse,
      irs
    } = useTer();


    return {
      activeStep,
      nerProgress,
      terProgress,
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
        resetTerProgress();
        resetNerProgress();

        if (file.value) {
          await nerAnalyse(file.value, fileType.value, params.value.ner);
          await terAnalyse(chunkList.value, params.value.ter);
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
