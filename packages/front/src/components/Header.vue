<template class="header">
  <el-container>
    <el-main style="padding: 0px; text-align: left">
      <img src="@/assets/trans_logo.png" width="90" height="50" />
    </el-main>
    <Undo />
  </el-container>
  <div class="separator"></div>
</template>

<style scoped>
.header {
  top: 0;
  width: 100%;
  height: 20px;
}
.separator {
  width: 100%;
  height: 1px;
  background: LightGrey;
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
