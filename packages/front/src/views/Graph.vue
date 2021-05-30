<template>
  <el-container direction="vertical">
    <Header
      showGraphOptions
      @hisBack="$emit('hisBack')"
      @hisForward="$emit('hisForward')"
    />
    <el-container>
      <el-main class="graph">
        <GraphRenderer
          v-if="graphRendererVisible"
          ref="graphRenderer"
          :graphStructure="graphStructureFiltered"
          @clickNode="onNodeClick"
          @mouseenterNode="onNodeMouseEnter"
          @mouseleaveNode="onNodeMouseLeave"
        />
        <GraphControls
          v-model:graphMode="graphMode"
          :editDisabled="!slider.isStatic"
          @fit="fit"
          @unpinAll="unpinAll"
          @pinAll="pinAll"
          @resetPosition="resetPosition"
        />
        <GraphInfo
          :graphStructure="graphStructureFiltered"
          :infoNode="infoNode"
        />
        <el-divider direction="vertical" class="divider" />
      </el-main>
      <el-aside width="auto" class="aside-bar">
        <GraphOptions
          :terProgress="progress"
          :irs="irs"
          v-model:filter-params="filterParams"
          @submitTer="onTerSubmit"
          @resetTer="onTerReset"
        />
      </el-aside>
    </el-container>
    <Slider v-model="slider" :limits="sliderLimits" />
    <Footer />
  </el-container>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  PropType,
  watch,
  computed
} from "vue";
import { useRouter } from "vue-router";
import _ from "lodash";
import {
  TextUnit,
  Irs,
  IrsParams,
  GraphService,
  GraphRendererService,
  GraphFilterService,
  IrsUtilsService,
  ChunkList,
  Chunk,
  Sentence,
  Token,
  Graph,
  defaultFilterParams,
  FilterParams,
  defaultGraph,
  Node,
  conf
} from "core";
import Header from "@/components/Header.vue";
import Slider from "@/components/graph/Slider.vue";
import GraphOptions from "@/components/graph/GraphOptions.vue";
import GraphInfo from "@/components/graph/GraphInfo.vue";
import GraphControls, { GraphMode } from "@/components/graph/GraphControls.vue";
import GraphRenderer from "@/components/graph/GraphRenderer.vue";
import Footer from "@/components/Footer.vue";
import { useTer } from "@/composables/useTer";

export interface SliderData {
  sliderRange: [number, number];
  isStatic: boolean;
  unit: TextUnit;
}

export default defineComponent({
  components: {
    Header,
    Slider,
    GraphOptions,
    Footer,
    GraphRenderer,
    GraphControls,
    GraphInfo
  },

  props: {
    irs: {
      type: Object as PropType<Irs>,
      required: false
    }
  },

  setup(props, { emit }) {
    const graphRendererVisible = ref(true);

    const { push } = useRouter();
    const { progress, irs, analyse, resetProgress } = useTer();
    const irsUtilsService = IrsUtilsService.get();

    const graphRenderer = ref<typeof GraphRenderer>();
    const fit = () => {
      graphRenderer.value?.fit();
    };

    const graphMode = ref(GraphMode.SELECT);

    const graphService = GraphService.get();

    const graphRendererService = GraphRendererService.get();

    const graphStructure = ref<Graph>(defaultGraph());
    const infoNode = ref<Node | null>(null);

    const selectedNodes = ref<[string | null, string | null]>([null, null]);

    const highlightNode = (nodeId: string) => {
      const nodeCircle = document.getElementById(nodeId);

      if (nodeCircle?.hasChildNodes()) {
        while (nodeCircle.firstChild) {
          nodeCircle.firstChild.remove();
        }
        return;
      }

      const colorAnimation = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate"
      );
      colorAnimation.setAttribute("attributeType", "XML");
      colorAnimation.setAttribute("attributeName", "fill");
      const colors = conf.NODE_HIGHLIGHT_COLORS;
      const colorValues = `${colors.join(";")};${colors.reverse().join(";")}`;
      colorAnimation.setAttribute("values", colorValues);
      colorAnimation.setAttribute("dur", "2s");
      colorAnimation.setAttribute("repeatCount", "indefinite");

      const radiusAnimation = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate"
      );
      radiusAnimation.setAttribute("attributeType", "XML");
      radiusAnimation.setAttribute("attributeName", "r");
      const radiuses = [];
      for (
        let radius = conf.MIN_NODE_RADIUS;
        radius < conf.MAX_NODE_RADIUS;
        radius += 3
      ) {
        radiuses.push(radius);
      }
      const radiusValues = `${radiuses.join(";")};${radiuses
        .reverse()
        .join(";")}`;
      radiusAnimation.setAttribute("values", radiusValues);
      radiusAnimation.setAttribute("dur", "5s");
      radiusAnimation.setAttribute("repeatCount", "indefinite");

      nodeCircle?.appendChild(colorAnimation);
      nodeCircle?.appendChild(radiusAnimation);
    };

    const onNodeClick = (payload: { node: Node; shiftPressed: boolean }) => {
      if (props.irs) {
        switch (graphMode.value) {
          case GraphMode.SELECT:
            payload.node.fx = payload.node.x;
            payload.node.fy = payload.node.y;
            break;
          case GraphMode.MERGE: {
            if (!selectedNodes.value[0]) {
              selectedNodes.value[0] = payload.node.id;
            } else if (selectedNodes.value[0] === payload.node.id) {
              selectedNodes.value[0] = null;
            } else {
              selectedNodes.value[1] = payload.node.id;
            }
            break;
          }
          case GraphMode.DELETE: {
            const updatedIrs = irsUtilsService.deleteNode(
              props.irs,
              payload.node.id
            );
            emit("irs", updatedIrs);
            break;
          }
        }
      }
    };

    const sliderLimits = ref({
      min: 0,
      max: 0
    });
    const slider = ref<SliderData>({
      sliderRange: [0, 100],
      isStatic: true,
      unit: TextUnit.SENTENCE
    });

    const resetSlider = () => {
      slider.value.sliderRange = [
        sliderLimits.value.min,
        sliderLimits.value.max
      ];
    };

    watch(
      slider,
      () => {
        if (!slider.value.isStatic) {
          graphMode.value = GraphMode.SELECT;
        } else {
          resetSlider();
        }
      },
      { immediate: true }
    );

    const firstChunk = (c: ChunkList) => _.first(c) as Chunk;
    const firstSentence = (c: ChunkList) =>
      _.first(firstChunk(c).sentences) as Sentence;
    const firstWord = (c: ChunkList) =>
      _.first(firstSentence(c).tokens) as Token;

    const lastChunk = (c: ChunkList) => _.last(c) as Chunk;
    const lastSentence = (c: ChunkList) =>
      _.last(lastChunk(c).sentences) as Sentence;
    const lastWord = (c: ChunkList) => _.last(lastSentence(c).tokens) as Token;

    watch(
      [() => slider.value.unit, () => props.irs],
      ([newUnit], [oldUnit]) => {
        const irs = props.irs;
        if (irs && newUnit !== oldUnit) {
          switch (slider.value.unit) {
            case TextUnit.CHUNK:
              sliderLimits.value = {
                min: firstChunk(irs.document).chunkIndex + 1,
                max: lastChunk(irs.document).chunkIndex + 1
              };
              break;
            case TextUnit.SENTENCE:
              sliderLimits.value = {
                min: firstSentence(irs.document).sentenceGlobalIndex + 1,
                max: lastSentence(irs.document).sentenceGlobalIndex + 1
              };
              break;
            case TextUnit.WORD:
              sliderLimits.value = {
                min: firstWord(irs.document).tokenGlobalIndex + 1,
                max: lastWord(irs.document).tokenGlobalIndex + 1
              };
              break;
          }

          resetSlider();
        }
      },
      { immediate: true }
    );

    watch(
      [
        () => slider.value.sliderRange,
        () => slider.value.unit,
        () => props.irs
      ],
      ([newRange, newUnit, newIrs], [oldRange, oldUnit, oldIrs]) => {
        if (
          newIrs &&
          (oldIrs !== newIrs ||
            !_.isEqual(newRange, oldRange) ||
            oldUnit !== newUnit)
        ) {
          console.log("filter & build triggered");
          const filteredIrs = irsUtilsService.getRelationsInPeriod(
            newIrs as Irs,
            slider.value.sliderRange[0],
            slider.value.sliderRange[1],
            slider.value.unit
          );
          graphStructure.value = graphService.buildGraphStructure(filteredIrs);
        }
      },
      { immediate: true }
    );

    const graphFilterService = GraphFilterService.get();
    const filterParams = ref<FilterParams>(defaultFilterParams());
    const graphStructureFiltered = computed(() => {
      return graphFilterService.filter(
        graphStructure.value,
        filterParams.value
      );
    });

    watch(
      () => selectedNodes.value,
      (oldNodes, currentNodes) => {
        if (currentNodes[0]) {
          highlightNode(currentNodes[0]);
        }
        // here we have to somehow know that shift was pressed (another varaible?)
        // we cant modify the array directly here cuz we will end up in a loop right?

        // const updatedIrs = irsUtilsService.mergeNodes(props.irs, selectedNodes);
        // emit("irs", updatedIrs);
        // setTimeout(() => highlightNode(selectedNodes.value[0]), 100);
      }
    );

    onMounted(() => {
      if (!props.irs) push("/");
    });

    return {
      graphRendererVisible,
      filterParams,
      sliderLimits,
      graphRenderer,
      graphMode,
      graphStructureFiltered,
      onNodeClick,
      infoNode,
      fit,
      slider,
      progress,
      onNodeMouseEnter(n: Node) {
        infoNode.value = n;
      },
      onNodeMouseLeave() {
        infoNode.value = null;
      },
      async onTerSubmit(p: IrsParams) {
        resetProgress();
        if (props.irs) {
          await analyse(props.irs?.document, p);
          emit("irs", irs.value);
        }
      },
      onTerReset() {
        resetProgress();
      },
      unpinAll() {
        graphRendererService.unpinAllNodes();
      },
      pinAll() {
        graphRendererService.pinAllNodes();
      },
      resetPosition() {
        graphRendererVisible.value = false;
        setTimeout(() => {
          if (props.irs) {
            const filteredIrs = irsUtilsService.getRelationsInPeriod(
              props.irs,
              slider.value.sliderRange[0],
              slider.value.sliderRange[1],
              slider.value.unit
            );
            graphRendererService.resetState();
            graphStructure.value = graphService.buildGraphStructure(
              filteredIrs
            );
            graphRendererVisible.value = true;
          }
        }, 100);
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
}
.aside-bar {
  overflow: visible;
  min-width: 300px;
}
</style>
