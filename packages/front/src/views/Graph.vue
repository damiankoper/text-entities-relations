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
import Header from "@/components/Header.vue";
import Slider from "@/components/graph/Slider.vue";
import GraphOptions from "@/components/graph/GraphOptions.vue";
import GraphInfo from "@/components/graph/GraphInfo.vue";
import GraphControls, { GraphMode } from "@/components/graph/GraphControls.vue";
import GraphRenderer from "@/components/graph/GraphRenderer.vue";
import Footer from "@/components/Footer.vue";
import _ from "lodash";
import {
  TextUnit,
  Irs,
  IrsParams,
  GraphService,
  GraphFilterService,
  IrsUtilsService,
  ChunkList,
  Chunk,
  Sentence,
  Token,
  Graph,
  defaultFilterParams,
  FilterParams,
  defaultGraph
} from "core";
import { useRouter } from "vue-router";
import { useTer } from "@/composables/useTer";
import { Node } from "core/lib/domain/Graph/Models/Node";

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
    console.log(props.irs);

    const { push } = useRouter();
    const { progress, irs, analyse, resetProgress } = useTer();
    const irsUtilsService = IrsUtilsService.get();

    const graphRenderer = ref<typeof GraphRenderer>();
    const fit = () => {
      graphRenderer.value?.fit();
    };

    const graphMode = ref(GraphMode.SELECT);

    const graphService = GraphService.get();

    const graphStructure = ref<Graph>(defaultGraph());
    const infoNode = ref<Node | null>(null);

    const selectedNodes = ref<[string | null, string | null]>([null, null]);

    const onNodeClick = (nodeId: string) => {
      if (props.irs) {
        switch (graphMode.value) {
          case GraphMode.SELECT:
            break;
          case GraphMode.MERGE:
            break;
          case GraphMode.DELETE:
            {
              const updatedIrs = irsUtilsService.deleteNode(props.irs, nodeId);
              graphStructure.value = graphService.buildGraphStructure(
                updatedIrs
              );
              emit("irs", updatedIrs);
            }
            break;
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

    onMounted(() => {
      if (!props.irs) push("/");
    });

    return {
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
        // TODO: Leszek :3
      },
      pinAll() {
        // TODO: Leszek :3
      },
      resetPosition() {
        // TODO: Leszek :3
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
