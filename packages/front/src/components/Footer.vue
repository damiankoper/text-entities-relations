<template>
  <el-footer class="footer">
    <div>
      <p>
        <span>
          © Made with love and paszyn
        </span>
      </p>
    </div>
  </el-footer>
</template>

<style scoped>
p {
  font-size: 15px;
  text-align: left;
  color: black;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  background: LightGrey;
  z-index: 100;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Footer",
  props: {}
});
</script>
