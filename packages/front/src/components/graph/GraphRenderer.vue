<template>
  <svg xmlns="http://www.w3.org/2000/svg" ref="graphSvgElement"></svg>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType, watch } from "vue";
import { Graph, GraphRendererService } from "core";

function renderGraph(
  service: GraphRendererService,
  structure: Graph,
  svgElement: SVGSVGElement | undefined,
  emit: (event: "clickNode", payload: string) => void
) {
  if (!svgElement) {
    return;
  }
  service.renderSvg(structure, svgElement, emit);
}

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

    watch(
      () => props.graphStructure,
      currentGraph => {
        renderGraph(
          graphRendererService,
          currentGraph,
          graphSvgElement.value,
          emit
        );
      }
    );

    onMounted(() => {
      renderGraph(
        graphRendererService,
        props.graphStructure,
        graphSvgElement.value,
        emit
      );
    });
    return {
      graphSvgElement
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

  & :deep .node-selected {
    stroke: #ff6666ff;
    stroke-width: 8px;
  }
}
</style>
