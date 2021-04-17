<template>
  <el-container>
    <el-header class="header-content">
      <!-- <el-header> -->
      <Header />
    </el-header>
    <el-container>
      <el-main>
        <GraphComponent />
      </el-main>
      <el-aside class="aside-bar">
        <GraphOptions />
      </el-aside>
    </el-container>
    <Slider />
  </el-container>
</template>

<style scoped>
.header-content {
  padding: 0px;
}
.aside-bar {
  min-height: 470px;
  width: 200px;
  overflow: visible;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import GraphComponent from "@/components/GraphComponent.vue";
import Header from "@/components/Header.vue";
import Slider from "@/components/Slider.vue";
import GraphOptions from "@/components/GraphOptions.vue";

export default defineComponent({
  name: "Graph",
  components: {
    GraphComponent,
    Header,
    Slider,
    GraphOptions
  }
});
</script>
