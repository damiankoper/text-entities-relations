<template>
  <el-container direction="vertical">
    <Header showGraphOptions />
    <el-container>
      <el-main class="graph">
        <GraphRenderer
          ref="graphRenderer"
          :graphStructure="graphStructure"
          @clickNode="onNodeClick"
        />
        <el-button v-on:click="fit" type="primary">Dopasuj</el-button>
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
  align-items: flex-end;
  justify-content: right;
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
import { defineComponent, ref } from "vue";
import Header from "@/components/Header.vue";
import Slider from "@/components/graph/Slider.vue";
import GraphOptions from "@/components/graph/GraphOptions.vue";
import GraphRenderer from "@/components/graph/GraphRenderer.vue";
import Footer from "@/components/Footer.vue";
import { GraphService, GraphZoomService } from "core";

export default defineComponent({
  name: "Graph",
  components: {
    Header,
    Slider,
    GraphOptions,
    Footer,
    GraphRenderer
  },
  setup() {
    const graphRenderer = ref<typeof GraphRenderer>();

    const graphService = GraphService.get();

    const graphZoomService = GraphZoomService.get();

    const graphStructure = graphService.buildGraphStructure([]);

    const selectedNodes = ref<string[]>([]);

    const onNodeClick = (nodeId: string) => {
      selectedNodes.value.push(nodeId);
      console.log(selectedNodes.value);
    };

    const fit = () => {
      const graphSvgElement = graphRenderer.value?.graphSvgElement;
      if (graphSvgElement) {
        graphZoomService.fitToScreen(graphSvgElement);
      }
    };

    return { graphRenderer, graphStructure, onNodeClick, fit };
  }
});
</script>
