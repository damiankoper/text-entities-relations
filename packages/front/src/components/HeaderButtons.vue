<template>
  <el-badge :value="counters.back" :hidden="!counters.back" class="item">
    <el-button
      size="medium"
      icon="el-icon-back"
      title="Cofnij"
      @click="$emit('hisBack')"
      :disabled="!counters.back"
      circle
    ></el-button>
  </el-badge>
  <el-badge :value="counters.forward" :hidden="!counters.forward" class="item">
    <el-button
      size="medium"
      icon="el-icon-right"
      title="Przywróć"
      @click="$emit('hisForward')"
      :disabled="!counters.forward"
      circle
    ></el-button>
  </el-badge>
  <el-divider direction="vertical" />
  <el-button
    size="medium"
    icon="el-icon-s-operation"
    title="Menu"
    @click="$emit('menuToggle')"
    circle
  ></el-button>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, Ref, ref } from "vue";
import { countersSymbol, HistoryCoutners } from "@/composables/useHistory";
export default defineComponent({
  emits: ["hisBack", "hisForward", "menuToggle"],
  setup(_, { emit }) {
    const counters = inject<Ref<HistoryCoutners>>(
      countersSymbol,
      () =>
        ref({
          forward: 0,
          back: 0
        }),
      true
    );

    function onKeyPress(e: KeyboardEvent) {
      if (e.ctrlKey) {
        if (e.key == "z" && counters.value.back) emit("hisBack");
        else if (e.key == "y" && counters.value.forward) emit("hisForward");
      }
    }
    onMounted(() => {
      document.addEventListener("keypress", onKeyPress);
    });
    onUnmounted(() => {
      document.removeEventListener("keypress", onKeyPress);
    });
    return { counters };
  }
});
</script>

<style lang="scss" scoped>
.item {
  margin-left: 8px;
  ::v-deep(sup) {
    margin-top: 4px;
    margin-right: 8px;
  }
}
</style>
