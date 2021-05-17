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
    <el-tab-pane label="Filtry" name="Filter">
      <Filter v-model="filterParamsInner" />
    </el-tab-pane>
    <el-tab-pane label="Eksport" name="Export">
      <Export :irs="irs" />
    </el-tab-pane>
  </el-tabs>
</template>

<style>
.el-tabs {
  margin: 0 16px;
}
.el-tabs__nav-scroll > .el-tabs__nav {
  width: 100%;
}

.el-tabs__nav > .el-tabs__item {
  width: 33%;
  text-align: center;
}
</style>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect, watch } from "vue";
import Export from "@/components/Export.vue";
import Filter from "@/components/Filter.vue";
import TerAnalyse from "@/components/graph/TerAnalyse.vue";
import { Irs, IrsParams, defaultFilterParams, FilterParams } from "core";
import { Progress, defaultProgress } from "@/common/constants";
import _ from "lodash";
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
      filterParamsInner,
      activeName: ref("TER"),
      onSubmit(params: IrsParams) {
        emit("submitTer", params);
      }
    };
  }
});
</script>
