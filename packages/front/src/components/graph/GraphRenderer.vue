<template>
  <svg xmlns="http://www.w3.org/2000/svg" ref="graphSvgElement"></svg>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType } from "vue";
import { Graph, GraphRendererService } from "core";

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

    onMounted(() => {
      if (graphSvgElement.value) {
        graphRendererService.renderSvg(
          props.graphStructure,
          graphSvgElement.value,
          emit
        );
      }
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
}
</style>
