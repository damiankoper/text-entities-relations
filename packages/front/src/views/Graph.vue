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
        <el-card class="controls">
          <el-button size="mini" v-on:click="fit" type="primary">
            Fit
          </el-button>
          <el-radio-group size="mini" v-model="selectedGraphModification">
            <el-radio-button
              size="mini"
              v-for="tool in graphTools"
              :key="tool.type"
              :label="tool.type"
            >
              <i :class="tool.icon"></i> {{ tool.hint }}
            </el-radio-button>
          </el-radio-group>
        </el-card>
        <el-divider direction="vertical" class="divider" />
      </el-main>
      <el-aside class="aside-bar">
        <GraphOptions
          :terProgress="progress"
          :irs="irs"
          @submitTer="onTerSubmit"
          @resetTer="onTerReset"
        />
      </el-aside>
    </el-container>
    <Slider v-model="slider" />
    <Footer />
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from "vue";
import Header from "@/components/Header.vue";
import Slider from "@/components/graph/Slider.vue";
import GraphOptions from "@/components/graph/GraphOptions.vue";
import GraphRenderer from "@/components/graph/GraphRenderer.vue";
import Footer from "@/components/Footer.vue";
import { TextUnit, Irs, IrsParams, GraphService } from "core";
import { useRouter } from "vue-router";
import { useTer } from "@/composables/useTer";
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

export interface SliderData {
  sliderRange: [number, number];
  isStatic: boolean;
  unit: TextUnit;
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

  props: {
    irs: {
      type: Object as PropType<Irs>,
      required: false
    }
  },

  setup(props, { emit }) {
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
        hint: "Delete",
        icon: "el-icon-delete",
        type: GraphModificationOption.DELETE
      },
      {
        hint: "Merge",
        icon: "el-icon-share",
        type: GraphModificationOption.MERGE
      }
    ];

    const { progress, irs, analyse, resetProgress } = useTer();

    const slider = ref<SliderData>({
      sliderRange: [0, 100],
      isStatic: true,
      unit: TextUnit.CHUNK
    });

    const { push } = useRouter();
    onMounted(() => {
      console.log(props.irs);
      if (!props.irs) push("/");
    });

    return {
      graphRenderer,
      selectedGraphModification,
      graphStructure,
      onNodeClick,
      fit,
      graphTools,
      slider,
      progress,
      async onTerSubmit(p: IrsParams) {
        resetProgress();
        if (props.irs) {
          await analyse(props.irs?.document, p);
          emit("irs", irs.value);
        }
      },
      onTerReset() {
        resetProgress();
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.graph {
  min-height: calc(
    100vh - 52px - 40px - 32px
  ); // 100% - header - slider - footer
  padding-bottom: 25px;
  padding: 0;
  position: relative;
  overflow: hidden;
  .divider {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    margin: 0;
  }
  .controls {
    position: absolute;
    bottom: 12px;
    right: 12px;
    ::v-deep(.el-card__body) {
      padding: 8px;
    }
    .el-button {
      margin-right: 8px;
    }
  }
}
.aside-bar {
  overflow: visible;
}
</style>
