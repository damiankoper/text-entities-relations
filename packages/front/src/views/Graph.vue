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
        <el-row type="flex" justify="end" align="middle">
          <el-space>
            <el-button v-on:click="fit" type="primary">Fit</el-button>
            <el-radio-group v-model="selectedGraphModification">
              <el-radio
                v-for="tool in graphTools"
                :key="tool.type"
                :label="tool.type"
              >
                <i :class="tool.icon"></i> {{ tool.hint }}
              </el-radio>
            </el-radio-group>
          </el-space>
        </el-row>
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
  flex-direction: column;
  min-height: calc(
    100vh - 52px - 40px - 32px
  ); // 100% - header - slider - footer
  padding-bottom: 5px;
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
import { GraphService } from "core";

enum GraphModificationOption {
  SELECT = "select",
  DELETE = "delete",
  MERGE = "merge"
}

interface GraphTool {
  hint: string;
  icon: string;
  type: GraphModificationOption;
}

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

    const selectedGraphModification = ref<GraphModificationOption>(
      GraphModificationOption.SELECT
    );

    const graphService = GraphService.get();

    const graphStructure = ref(graphService.buildGraphStructure([]));

    const selectedNodes = ref<[string, string]>();

    const onNodeClick = (nodeId: string) => {
      switch (selectedGraphModification.value) {
        case GraphModificationOption.SELECT:
          break;
        case GraphModificationOption.MERGE:
          break;
        case GraphModificationOption.DELETE:
          graphService.deleteNode(nodeId);
          graphStructure.value = graphService.buildGraphStructure([]);
          break;
      }
    };

    const fit = () => {
      graphRenderer.value?.fit();
    };

    const graphTools: GraphTool[] = [
      {
        hint: "Click",
        icon: "el-icon-thumb",
        type: GraphModificationOption.SELECT
      },
      {
        hint: "Delete nodes",
        icon: "el-icon-delete",
        type: GraphModificationOption.DELETE
      },
      {
        hint: "Merge nodes",
        icon: "el-icon-share",
        type: GraphModificationOption.MERGE
      }
    ];

    return {
      graphRenderer,
      selectedGraphModification,
      graphStructure,
      onNodeClick,
      fit,
      graphTools
    };
  }
});
</script>
