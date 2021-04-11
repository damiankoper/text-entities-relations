<template>
  <svg
    width="100%"
    height="80vh"
    xmlns="http://www.w3.org/2000/svg"
    ref="graphSvgElement"
  ></svg>
  <el-button v-on:click="fit" type="primary">FIT</el-button>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType } from "vue";
import { Graph, GraphRendererService } from "core";

export default defineComponent({
  name: "SvgRenderer",
  emits: ["clickNode"],
  props: {
    graphStructure: {
      type: Object as PropType<Graph>,
      required: true
    }
  },
  setup(props, { emit }) {
    const graphSvgElement = ref<SVGSVGElement>();

    const graphRenderer = GraphRendererService.get();

    const fit = () => {
      if (graphSvgElement.value) {
        graphRenderer.fitToScreen(graphSvgElement.value);
      }
    };

    onMounted(() => {
      if (graphSvgElement.value) {
        graphRenderer.renderSvg(
          props.graphStructure,
          graphSvgElement.value,
          emit
        );
      }
    });
    return {
      fit,
      graphSvgElement
    };
  }
});
</script>

<style scoped lang="scss">
.node {
}

.link {
}
</style>
