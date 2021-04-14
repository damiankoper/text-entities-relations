<template>
  <el-container class="import-root">
    <el-header class="header-content">
      <Header />
    </el-header>
    <b class="title">Import</b>
    <el-container>
      <el-aside class="aside-bar">
        <el-steps direction="vertical" :active="activeStep">
          <el-step title="Dane wejściowe"></el-step>
          <el-step title="Ustaw parametry"></el-step>
          <el-step title="Analiza"></el-step>
          <el-step title="Wizualizacja"></el-step>
        </el-steps>
      </el-aside>
      <el-container>
        <el-main class="import-content">
          <ImportStep1 v-if="activeStep == 1" class="single-step" />

          <ImportStep2 v-if="activeStep == 2" class="single-step" />

          <ImportStep3 v-if="activeStep == 3" class="single-step" />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<style scoped>
.title {
  text-align: left;
  font-size: 30px;
}
.import-root {
  padding-bottom: 60px;
}
.import-content {
  overflow: visible;
  padding: 0px;
}
.aside-bar {
  min-height: 375px;
  width: 200px;
  overflow: visible;
}
.single-step {
  height: 100%;
}
.header-content {
  padding: 0px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import ImportStep1 from "@/components/ImportStep1.vue";
import ImportStep2 from "@/components/ImportStep2.vue";
import ImportStep3 from "@/components/ImportStep3.vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "Import",
  components: {
    ImportStep1,
    ImportStep2,
    ImportStep3,
    Header
  },
  data() {
    return {
      activeStep: 3
    };
  }
});
</script>
