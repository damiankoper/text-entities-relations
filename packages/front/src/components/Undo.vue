<template>
  <el-badge :value="stepsBack" :hidden="!stepsBack" class="item">
    <el-button
      size="medium"
      icon="el-icon-back"
      title="Cofnij"
      @click="hisBack()"
      :disabled="!stepsBack"
      round
    ></el-button>
  </el-badge>
  <el-badge :value="stepsForward" :hidden="!stepsForward" class="item">
    <el-button
      size="medium"
      icon="el-icon-right"
      title="Przywróć"
      @click="hisForward()"
      :disabled="!stepsForward"
      round
    ></el-button>
  </el-badge>
</template>

<style></style>

<script lang="ts">
import { defineComponent } from "vue";
import { IrsHistory } from "@/common/irsHistory";
export default defineComponent({
  name: "Undo",
  emits: ["hisBack", "hisForward"],
  setup(_, { emit }) {
    const irsHistory = IrsHistory.getInstance();
    return {
      irsHistory,
      hisBack() {
        emit("hisBack");
      },
      hisForward() {
        emit("hisForward");
      }
    };
  },
  computed: {
    stepsForward(): number {
      const { current, history } = this.irsHistory;
      return history.length - current.value - 1;
    },
    stepsBack(): number {
      const { current } = this.irsHistory;
      if (current.value < 0) {
        return 0;
      }
      return current.value;
    }
  }
});
</script>
