<template class="header">
  <el-container>
    <el-main style="padding: 0px; text-align: left">
      <img src="@/assets/trans_logo.png" width="90" height="50" />
    </el-main>
    <UndoComponent />
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
import UndoComponent from "@/components/UndoComponent.vue";
export default defineComponent({
  name: "Header",
  components: {
    UndoComponent
  }
});
</script>
