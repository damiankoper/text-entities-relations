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
    <el-tab-pane label="Filtry" name="Filter"><Filter /></el-tab-pane>
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
import { defineComponent, PropType, ref } from "vue";
import Export from "@/components/Export.vue";
import Filter from "@/components/Filter.vue";
import TerAnalyse from "@/components/graph/TerAnalyse.vue";
import { Irs, IrsParams } from "core";
import { Progress, defaultProgress } from "@/common/constants";

export default defineComponent({
  name: "GraphOptions",
  components: {
    TerAnalyse,
    Export,
    Filter
  },
  emits: ["submitTer", "resetTer"],
  props: {
    terProgress: {
      type: Object as PropType<Progress>,
      default: defaultProgress
    },
    irs: {
      type: Object as PropType<Irs>,
      required: false
    }
  },

  setup(_, { emit }) {
    return {
      activeName: ref("TER"),
      onSubmit(params: IrsParams) {
        emit("submitTer", params);
      }
    };
  }
});
</script>
