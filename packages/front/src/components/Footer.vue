<template>
  <el-footer class="footer" height="32px">
    <span>&copy; TER {{ new Date().getFullYear() }}. All rights reserved.</span>
    <span>Made with ❤️ & 🍺</span>
  </el-footer>
</template>

<style scoped>
.footer {
  background: #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Footer",
  props: {}
});
</script>
