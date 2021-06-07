<template>
  <el-header height="52px" class="header">
    <router-link class="header" to="/">
      <el-image :src="logoImg" class="header-img" />
      <span class="header-text">TER</span>
    </router-link>
    <span style="width:100%"></span>
    <HeaderButtons
      v-if="showGraphOptions"
      @hisBack="$emit('hisBack')"
      @hisForward="$emit('hisForward')"
      @menuToggle="$emit('menuToggle')"
    />
  </el-header>
  <el-divider style="margin: 0; margin-top: -1px" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderButtons from "@/components/HeaderButtons.vue";
export default defineComponent({
  components: {
    HeaderButtons
  },
  props: {
    showGraphOptions: {
      type: Boolean,
      default: false
    }
  },
  emits: ["hisBack", "hisForward", "menuToggle"],
  setup() {
    return {
      logoImg: require("@/assets/books.svg")
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
    width: 40px;
    margin-right: 12px;
  }

  &-text {
    margin-top: 6px;
    font-weight: 900;
    font-size: 40px;
  }
}
</style>
