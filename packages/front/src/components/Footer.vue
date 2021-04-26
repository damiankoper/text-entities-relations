<template>
  <el-footer class="footer" height="32px">
    &copy; TER {{ new Date().getFullYear() }}. All rights reserved.
  </el-footer>
</template>

<style scoped>
.footer {
  background: #ebeef5;
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
