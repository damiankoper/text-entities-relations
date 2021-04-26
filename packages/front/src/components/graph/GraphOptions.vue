<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="TER" name="TER"><Ter /></el-tab-pane>
    <el-tab-pane label="Filtry" name="Filter"><Filter /></el-tab-pane>
    <el-tab-pane label="Eksport" name="Export"><Export /></el-tab-pane>
  </el-tabs>
</template>

<style>
.el-tabs__nav-scroll > .el-tabs__nav {
  width: 100%;
}

.el-tabs__nav > .el-tabs__item {
  width: 33%;
  text-align: center;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import Export from "@/components/Export.vue";
import Ter from "@/components/Ter.vue";
import Filter from "@/components/Filter.vue";
export default defineComponent({
  name: "GraphOptions",
  components: {
    Ter,
    Export,
    Filter
  },
  props: {
    nodes: Array
  },

  data() {
    return {
      activeName: "TER"
    };
  },
  methods: {}
});
</script>
