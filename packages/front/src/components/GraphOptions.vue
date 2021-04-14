<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Ter" name="Ter"><Ter /></el-tab-pane>
      <el-tab-pane label="Filtry" name="Filter"><Filter /></el-tab-pane>
      <el-tab-pane label="Eksport" name="Export"><Export /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped></style>

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
      activeName: "Ter"
    };
  },
  methods: {}
});
</script>
