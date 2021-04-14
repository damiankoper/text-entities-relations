<template>
  <el-button class="undo-button">&lt; undo</el-button>
  <el-button class="undo-button">redo &gt;</el-button>
</template>

<style>
.undo-button {
  width: 80px;
  height: 20px;
  margin-right: 10px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Undo"
});
</script>
