<template>
  <el-container class="import-root">
    <el-header class="header-content">
      <HeaderComponent />
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
          <ImportStep1Component v-if="activeStep == 1" class="single-step" />

          <ImportStep2Component v-if="activeStep == 2" class="single-step" />

          <ImportStep3Component v-if="activeStep == 3" class="single-step" />
        </el-main>
      </el-container>
    </el-container>
    <FooterComponent />
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
import ImportStep1Component from "@/components/ImportStep1Component.vue";
import ImportStep2Component from "@/components/ImportStep2Component.vue";
import ImportStep3Component from "@/components/ImportStep3Component.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

export default defineComponent({
  name: "Import",
  components: {
    ImportStep1Component,
    ImportStep2Component,
    ImportStep3Component,
    FooterComponent,
    HeaderComponent
  },
  data() {
    return {
      activeStep: 2
    };
  }
});
</script>
