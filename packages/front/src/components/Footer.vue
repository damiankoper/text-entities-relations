<template>
  <el-footer class="footer" height="32px">
    &copy; TER {{ new Date().getFullYear() }}. All rights reserved.
  </el-footer>
</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #ebeef5;
  z-index: 100;
  display: flex;
  align-items: center;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Footer",
  props: {}
});
</script>
