<template>
  <el-card class="info">
    <div>
      <h6>Typ wierzchołka: {{ weight }}</h6>
      <h6>Liczba sąsiadów: {{ weight }}</h6>
      <h6>Liczba relacji: {{ weight }}</h6>
      <div class="number-scale">
        <div>{{ graphStructure.weight.min }}</div>
        <div class="color-scale" :style="{ background }"></div>
        <div>{{ graphStructure.weight.max }}</div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { Graph } from "core";
import { interpolateHsl } from "d3-interpolate";
import { easeExpOut } from "d3-ease";
import { Node } from "core/lib/domain/Graph/Models/Node";

export default defineComponent({
  emits: ["fit", "pinAll", "unpinAll", "resetPosition", "update:graphMode"],
  props: {
    graphStructure: {
      type: Object as PropType<Graph>,
      required: true
    },
    infoNode: {
      type: Object as PropType<Node>,
      required: false
    }
  },
  setup(props) {
    return {
      relationsCount: computed(() => {
        return props.infoNode ? props.infoNode.weight : "___";
      }),
      background: computed(() => {
        const g = props.graphStructure;
        const int = interpolateHsl(g.weight.colorMin, g.weight.colorMax);
        const bg = [];
        const span = g.weight.max - g.weight.min;
        for (let i = span - 1; i > 0; i--) {
          bg.push(int(1 - easeExpOut(i / span)));
        }
        return "linear-gradient(to right," + bg.join(",") + ")";
      })
    };
  }
});
</script>

<style lang="scss" scoped>
.info {
  position: absolute;
  bottom: 12px;
  left: 12px;
  ::v-deep(.el-card__body) {
    padding: 8px;
  }
  h6 {
    margin-top: 0;
    margin-bottom: 8px;
    margin-left: 16px;
  }
  .color-scale {
    width: 300px;
    height: 20px;
    border-radius: 4px;
    border: solid #555 1px;
    margin: 0 4px;
  }
  .number-scale {
    display: flex;
    margin: 4px 0;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
