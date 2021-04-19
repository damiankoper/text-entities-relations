<template>
  <el-card>
    Graph Component
  </el-card>
</template>

<style scoped>
.box {
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "GraphComponent",
  props: {
    nodes: Array
  }
});
</script>
