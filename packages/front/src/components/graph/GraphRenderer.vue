<template>
  <svg xmlns="http://www.w3.org/2000/svg" ref="graphSvgElement"></svg>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType, watch } from "vue";
import { Graph, GraphRendererService, GraphZoomService } from "core";

export default defineComponent({
  name: "GraphRenderer",
  emits: ["clickNode"],
  props: {
    graphStructure: {
      type: Object as PropType<Graph>,
      required: true
    }
  },
  setup(props, { emit }) {
    const graphSvgElement = ref<SVGSVGElement>();

    const graphRendererService = GraphRendererService.get();

    const graphZoomService = GraphZoomService.get();

    const fit = () => {
      if (graphSvgElement.value) {
        graphZoomService.fitToScreen(graphSvgElement.value);
      }
    };

    watch(
      () => props.graphStructure,
      currentGraph => graphRendererService.renderSvg(currentGraph, emit)
    );

    onMounted(() => {
      if (graphSvgElement.value) {
        graphRendererService.initializeSimulation(graphSvgElement.value);
        graphRendererService.renderSvg(props.graphStructure, emit);
      }
    });

    return {
      graphSvgElement,
      fit
    };
  }
});
</script>

<style scoped lang="scss">
svg {
  height: 100%;
  width: 100%;

  & :deep .node-container {
    cursor: pointer;
  }
}
</style>