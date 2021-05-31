<template>
  <el-card class="controls">
    <div v-if="rename">
      <div class="rename-label">Zmień nazwę ({{ rename }}):</div>
      <div class="rename">
        <el-input
          v-model="newName"
          size="small"
          ref="renameInput"
          :disabled="renameMergeVisible"
          @keypres.enter="onRename"
        />
        <el-popover
          placement="top"
          title="Konflikt"
          :width="300"
          trigger="manual"
          v-model:visible="renameMergeVisible"
        >
          Wierzchołek "{{ newName }}" już istnieje. Czy chcesz stalić "{{
            newName
          }}" z "{{ rename }}"?
          <div style="text-align: right; margin: 0">
            <el-button
              size="mini"
              type="text"
              @click="$emit('renameMerge', { merge: false, name: newName })"
            >
              Nie
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="$emit('renameMerge', { merge: true, name: newName })"
            >
              Tak
            </el-button>
          </div>
          <template #reference>
            <el-button
              type="primary"
              size="mini"
              style="margin-right:0"
              @click="onRename"
              :disabled="!newName || newName === rename"
            >
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </template>
        </el-popover>
      </div>
    </div>
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
        :title="tool.hint"
      >
        <i :class="tool.icon"></i>
      </el-radio-button>
    </el-radio-group>
    <el-dropdown class="menu" placement="top">
      <el-button type="primary" size="mini" style="margin-right:0">
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
import {
  defineComponent,
  ref,
  PropType,
  watchEffect,
  watch,
  nextTick
} from "vue";

export enum GraphMode {
  SELECT = "select",
  DELETE = "delete",
  MERGE = "merge",
  RENAME = "rename"
}

export interface GraphModeDisplay {
  hint: string;
  icon: string;
  type: GraphMode;
}

export default defineComponent({
  emits: [
    "fit",
    "pinAll",
    "unpinAll",
    "resetPosition",
    "rename",
    "renameMerge",
    "update:graphMode"
  ],
  props: {
    editDisabled: {
      type: Boolean,
      default: false
    },
    graphMode: {
      type: String as PropType<GraphMode>,
      required: true
    },
    rename: {
      type: String,
      requried: false
    },
    renameMerge: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const renameInput = ref<HTMLInputElement | null>(null);
    const newName = ref("");
    const renameMergeVisible = ref(false);
    watchEffect(() => (renameMergeVisible.value = props.renameMerge));
    const graphModeInner = ref(GraphMode.SELECT);
    watchEffect(() => (graphModeInner.value = props.graphMode));
    watch(graphModeInner, () => emit("update:graphMode", graphModeInner.value));

    const graphModes: GraphModeDisplay[] = [
      { hint: "Przypnij", icon: "el-icon-thumb", type: GraphMode.SELECT },
      { hint: "Usuń", icon: "el-icon-delete", type: GraphMode.DELETE },
      { hint: "Scal", icon: "el-icon-share", type: GraphMode.MERGE },
      { hint: "Zmień nazwę", icon: "el-icon-edit", type: GraphMode.RENAME }
    ];

    watch(
      () => props.rename,
      () => {
        newName.value = props.rename || "";
        nextTick(() => {
          if (renameInput.value) renameInput.value.focus();
        });
      }
    );

    return {
      renameMergeVisible,
      renameInput,
      newName,
      graphModes,
      graphModeInner,
      onRename() {
        if (newName.value) emit("rename", newName.value);
      }
    };
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
  .rename {
    display: flex;
    margin-bottom: 8px;
    &-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 250px;
      margin-bottom: 4px;
    }
    button {
      margin-left: 8px;
      padding-left: 8px;
      padding-right: 8px;
    }
    ::v-deep input {
      padding: 8px;
    }
  }
}
</style>
