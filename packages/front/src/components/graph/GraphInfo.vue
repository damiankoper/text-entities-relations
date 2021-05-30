<template>
  <el-card class="info">
    <div>
      <h6>Typ wierzchołka: {{ type }}</h6>
      <h6>Liczba sąsiadów: {{ neighboursCount }}</h6>
      <h6>Liczba relacji: {{ relationsCount }}</h6>
      <h6>Kolorowanie na podstawie liczby relacji:</h6>
      <div class="number-scale">
        <div>{{ graphStructure.weight.min }}</div>
        <div class="color-scale" :style="{ background }">
          <div
            class="mark"
            :style="{
              left: markLeft + '%'
            }"
          ></div>
        </div>
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
import { tokenTypes } from "@/common/constants";

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
      markLeft: computed(() => {
        return (
          ((props.infoNode?.relationsCount ||
            0 - props.graphStructure.weight.min) /
            (props.graphStructure.weight.max -
              props.graphStructure.weight.min)) *
          100
        );
      }),
      type: computed(() => {
        return props.infoNode
          ? tokenTypes.find(t => t.value === props.infoNode?.type)?.label
          : "___";
      }),
      neighboursCount: computed(() => {
        return props.infoNode ? props.infoNode.neighboursCount : "___";
      }),
      relationsCount: computed(() => {
        return props.infoNode ? props.infoNode.relationsCount : "___";
      }),
      background: computed(() => {
        const g = props.graphStructure;
        const int = interpolateHsl(g.weight.colorMin, g.weight.colorMax);
        const bg = [];
        const span = g.weight.max - g.weight.min;
        for (let i = span - 1; i > 0; i--) {
          bg.push(int(easeExpOut(1 - i / span)));
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
    .mark {
      width: 1px;
      height: 100%;
      background: white;
      position: relative;
    }
  }
  .number-scale {
    display: flex;
    margin: 4px 0;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
