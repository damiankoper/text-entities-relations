<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="TER" name="TER">
      <TerAnalyse
        :terProgress="terProgress"
        :irs="irs"
        @submit="onSubmit"
        @reset="$emit('resetTer')"
      />
    </el-tab-pane>
    <el-tab-pane name="Filter">
      <template #label>
        <el-badge :hidden="!isFilterSet" is-dot type="danger" class="item">
          Filtry
        </el-badge>
      </template>
      <Filter v-model="filterParamsInner" />
    </el-tab-pane>
    <el-tab-pane label="Eksport" name="Export">
      <Export :irs="irs" :graph="graph" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  watchEffect,
  watch,
  computed
} from "vue";
import Export from "@/components/Export.vue";
import Filter from "@/components/Filter.vue";
import TerAnalyse from "@/components/graph/TerAnalyse.vue";
import { Irs, IrsParams, defaultFilterParams, FilterParams, Graph } from "core";
import { Progress, defaultProgress } from "@/common/constants";
export default defineComponent({
  name: "GraphOptions",
  components: {
    TerAnalyse,
    Export,
    Filter
  },
  emits: ["submitTer", "resetTer", "update:filterParams"],
  props: {
    terProgress: {
      type: Object as PropType<Progress>,
      default: defaultProgress
    },
    irs: {
      type: Object as PropType<Irs>,
      required: false
    },
    graph: {
      type: Object as PropType<Graph>,
      required: false
    },
    filterParams: {
      type: Object as PropType<FilterParams>,
      required: true
    }
  },

  setup(props, { emit }) {
    const filterParamsInner = ref<FilterParams>(defaultFilterParams());
    watchEffect(() => (filterParamsInner.value = props.filterParams));
    watch(filterParamsInner, () =>
      emit("update:filterParams", filterParamsInner.value)
    );

    return {
      isFilterSet: computed(
        () =>
          filterParamsInner.value.name.values.length ||
          filterParamsInner.value.minWeight
      ),
      filterParamsInner,
      activeName: ref("TER"),
      onSubmit(params: IrsParams) {
        emit("submitTer", params);
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.el-tabs {
  margin: 0 16px;
  :deep(.el-tabs__nav-scroll) > .el-tabs__nav {
    width: 100%;
  }

  :deep(.el-tabs__nav) > .el-tabs__item {
    width: 33%;
    text-align: center;
  }
}

.item {
  :deep(sup) {
    margin-top: 8px;
    margin-right: -4px;
  }
}
</style>
