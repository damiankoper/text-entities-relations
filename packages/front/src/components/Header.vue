<template class="header">
  <el-container>
    <el-main class="logo-wrapper">
      <img src="@/assets/trans_logo.png" width="90" height="50" />
    </el-main>
    <Undo />
  </el-container>
  <el-divider style="margin:12px 0" />
</template>

<style scoped>
.logo-wrapper {
  padding-bottom: 0px;
  padding-top: 0px;
  text-align: left;
}
.header {
  top: 0;
  width: 100%;
  height: 20px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import Undo from "@/components/Undo.vue";
export default defineComponent({
  name: "Header",
  components: {
    Undo
  }
});
</script>
