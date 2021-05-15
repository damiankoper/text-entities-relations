<template>
  <el-header height="52px" class="header">
    <router-link class="header" to="/">
      <el-image :src="logoImg" class="header-img" />
      <span class="header-text">TER</span>
    </router-link>
    <span style="width:100%"></span>
    <Undo v-if="showGraphOptions" @hisBack="hisBack" @hisForward="hisForward" />
  </el-header>
  <el-divider style="margin: 0; margin-top: -1px" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Undo from "@/components/Undo.vue";
export default defineComponent({
  name: "Header",
  components: {
    Undo
  },
  props: {
    showGraphOptions: {
      type: Boolean,
      default: false
    }
  },
  emits: ["hisBack", "hisForward"],
  setup(_, { emit }) {
    return {
      logoImg: require("@/assets/books.svg"),
      hisBack() {
        emit("hisBack");
      },
      hisForward() {
        emit("hisForward");
      }
    };
  }
});
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none !important;
  &-img {
    height: 40px;
    width: 40px;
    margin-right: 12px;
  }

  &-text {
    font-weight: 900;
    font-size: 40px;
  }
}
</style>
