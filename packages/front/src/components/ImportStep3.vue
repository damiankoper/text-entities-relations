<template>
  <div class="box">
    <h2 class="title">Analiza</h2>
    <div class="progress-wrapper">
      <el-row>
        <el-col :span="12">
          <el-progress
            type="circle"
            :percentage="100"
            status="success"
          ></el-progress>
          <h1>Parametry NER</h1>
        </el-col>
        <el-col :span="12">
          <el-progress
            type="circle"
            :percentage="100"
            status="success"
          ></el-progress>
          <h1>Parametry TER</h1>
        </el-col>
      </el-row>
    </div>

    <div class="buttons-wrapper">
      <el-button type="primary" disabled icon="el-icon-arrow-left">
        wstecz
      </el-button>
      <el-button type="primary" disabled>
        Przejdź do wizualizacji
        <i class="el-icon-arrow-right el-icon-right"></i>
      </el-button>
    </div>
  </div>
</template>

<style>
.box {
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.title {
  text-align: left;
  padding-top: 10px;
  padding-left: 10px;
  font-size: 30px;
}
.buttons-wrapper {
  padding-top: 80px;
  padding-bottom: 10px;
}
.progress-wrapper {
  padding-top: 40px;
  padding-bottom: 30px;
}
.progress {
  margin-left: 10px;
  margin-right: 10px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ImportStep3",
  props: {}
});
</script>
