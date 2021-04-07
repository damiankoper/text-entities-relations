<template>
  <div class="box">
    <el-container>
      <b class="title">Analiza</b>
      <el-main>
        <el-col :span="12">
          <el-row>
            <el-progress
              type="circle"
              :percentage="100"
              status="success"
            ></el-progress>
          </el-row>
          <el-row>
            <b>Parametry NER</b>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-progress
              type="circle"
              :percentage="100"
              status="success"
            ></el-progress>
          </el-row>
          <el-row>
            <b>Parametry TER</b>
          </el-row>
        </el-col>
      </el-main>
    </el-container>
    <el-button type="primary" disabled icon="el-icon-arrow-left">
      wstecz
    </el-button>
    <el-button type="primary" disabled>
      Przejdź do wizualizacji
      <i class="el-icon-arrow-right el-icon-right"></i>
    </el-button>
  </div>
</template>

<style>
.box {
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ImportStep3Component",
  props: {}
});
</script>
