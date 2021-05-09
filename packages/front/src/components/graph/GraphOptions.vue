<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="TER" name="TER"
      ><TerAnalyse
        :terProgress="terProgress"
        :inProgress="inProgress"
        @submit="onSubmit"
    /></el-tab-pane>
    <el-tab-pane label="Filtry" name="Filter"><Filter /></el-tab-pane>
    <el-tab-pane label="Eksport" name="Export"><Export /></el-tab-pane>
  </el-tabs>
</template>

<style>
.el-tabs {
  margin-right: 16px;
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
import { defineComponent, PropType } from "vue";
import Export from "@/components/Export.vue";
import Filter from "@/components/Filter.vue";
import TerAnalyse from "@/components/graph/TerAnalyse.vue";
import { Progress } from "../import/ImportAnalyse.vue";
import { TerParamsObj } from "../TerParams.vue";

export default defineComponent({
  name: "GraphOptions",
  components: {
    TerAnalyse,
    Export,
    Filter
  },
  props: {
    terProgress: { type: Object as PropType<Progress>, default: () => ({}) },
    inProgress: { type: Boolean, default: false },
    nodes: Array
  },

  data() {
    return {
      activeName: "TER"
    };
  },

  methods: {
    onSubmit(params: TerParamsObj) {
      this.$emit("submit", params);
    }
  }
});
</script>
