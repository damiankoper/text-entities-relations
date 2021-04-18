<template>
  <el-container direction="vertical">
    <Header :showGraphOptions="true" />
    <el-container>
      <el-main class="graph">
        <GraphComponent />
      </el-main>
      <el-aside class="aside-bar">
        <GraphOptions />
      </el-aside>
    </el-container>
    <Slider />
    <Footer />
  </el-container>
</template>

<style lang="scss" scoped>
.graph {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: calc(
    100vh - 52px - 40px - 32px
  ); // 100% - header - slider - footer
}
.aside-bar {
  overflow: visible;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import GraphComponent from "@/components/graph/GraphComponent.vue";
import Header from "@/components/Header.vue";
import Slider from "@/components/graph/Slider.vue";
import GraphOptions from "@/components/graph/GraphOptions.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "Graph",
  components: {
    GraphComponent,
    Header,
    Slider,
    GraphOptions,
    Footer
  }
});
</script>
