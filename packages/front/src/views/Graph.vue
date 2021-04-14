<template>
  <el-container>
    <el-header class="header-content">
      <Header />
    </el-header>
    <el-container>
      <el-main>
        <Graph />
      </el-main>
      <el-aside width="300px">
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
</style>

<script lang="ts">
import { defineComponent } from "vue";
import Graph from "@/components/Graph.vue";
import Header from "@/components/Header.vue";
import Slider from "@/components/Slider.vue";
import GraphOptions from "@/components/GraphOptions.vue";

export default defineComponent({
  name: "Graph",
  components: {
    Graph,
    Header,
    Slider,
    GraphOptions
  }
});
</script>
