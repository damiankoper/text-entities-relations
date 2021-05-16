<template>
  <el-badge :value="counters.back" :hidden="!counters.back" class="item">
    <el-button
      size="medium"
      icon="el-icon-back"
      title="Cofnij"
      @click="$emit('hisBack')"
      :disabled="!counters.back"
      round
    ></el-button>
  </el-badge>
  <el-badge :value="counters.forward" :hidden="!counters.forward" class="item">
    <el-button
      size="medium"
      icon="el-icon-right"
      title="Przywróć"
      @click="$emit('hisForward')"
      :disabled="!counters.forward"
      round
    ></el-button>
  </el-badge>
</template>

<style></style>

<script lang="ts">
import { defineComponent, inject } from "vue";
import { countersSymbol, HistoryCoutners } from "@/composables/useHistory";
export default defineComponent({
  name: "Undo",
  emits: ["hisBack", "hisForward"],
  setup() {
    const counters = inject<HistoryCoutners>(
      countersSymbol,
      () => ({
        forward: 0,
        back: 0
      }),
      true
    );
    return { counters };
  }
});
</script>
