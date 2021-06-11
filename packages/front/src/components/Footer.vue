<template>
  <el-footer class="footer" height="32px">
    <span>
      Icons made by
      <a href="https://www.freepik.com" title="Freepik">Freepik</a> from
      <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
    </span>
    <span>Made with ❤️</span>
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
