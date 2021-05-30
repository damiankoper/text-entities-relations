<template>
  <el-card class="controls">
    <el-button
      title="Wyśrodkuj"
      size="mini"
      @click="$emit('fit')"
      type="primary"
    >
      <el-icon class="el-icon-aim" />
    </el-button>
    <el-radio-group size="mini" v-model="graphModeInner">
      <el-radio-button
        size="mini"
        v-for="tool in graphModes"
        :key="tool.type"
        :label="tool.type"
        :disabled="editDisabled"
      >
        <i :class="tool.icon"></i> {{ tool.hint }}
      </el-radio-button>
    </el-radio-group>
    <el-dropdown class="menu" placement="top">
      <el-button type="primary" size="mini">
        <i class="el-icon-arrow-down"></i>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="$emit('pinAll')">
            <el-icon class="el-icon-thumb el-icon--left"></el-icon>
            Przypnij wszystkie
          </el-dropdown-item>
          <el-dropdown-item @click="$emit('unpinAll')">
            <el-icon class="el-icon-thumb el-icon--left"></el-icon>
            Odepnij wszystkie
          </el-dropdown-item>
          <el-dropdown-item @click="$emit('resetPosition')">
            <el-icon class="el-icon-magic-stick el-icon--left"></el-icon>
            Resetuj układ
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watchEffect, watch } from "vue";

export enum GraphMode {
  SELECT = "select",
  DELETE = "delete",
  MERGE = "merge"
}

export interface GraphModeDisplay {
  hint: string;
  icon: string;
  type: GraphMode;
}

export default defineComponent({
  emits: ["fit", "pinAll", "unpinAll", "resetPosition", "update:graphMode"],
  props: {
    editDisabled: {
      type: Boolean,
      default: false
    },
    graphMode: {
      type: String as PropType<GraphMode>,
      required: true
    }
  },
  setup(props, { emit }) {
    const graphModeInner = ref(GraphMode.SELECT);
    watchEffect(() => (graphModeInner.value = props.graphMode));
    watch(graphModeInner, () => emit("update:graphMode", graphModeInner.value));

    const graphModes: GraphModeDisplay[] = [
      { hint: "Przypnij", icon: "el-icon-thumb", type: GraphMode.SELECT },
      { hint: "Usuń", icon: "el-icon-delete", type: GraphMode.DELETE },
      { hint: "Scal", icon: "el-icon-share", type: GraphMode.MERGE }
    ];

    return { graphModes, graphModeInner };
  }
});
</script>

<style lang="scss" scoped>
.controls {
  user-select: none;
  position: absolute;
  bottom: 12px;
  right: 12px;
  ::v-deep(.el-card__body) {
    padding: 8px;
  }
  .el-button {
    margin-right: 8px;
  }
  .menu {
    button {
      margin-left: 8px;
      padding-left: 8px;
      padding-right: 8px;
    }
  }
}
</style>
