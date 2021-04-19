<template>
  <el-card class="box-card">
    <template #header>
      <h2 class="title">Analiza</h2>
    </template>
    <el-row type="flex" justify="space-around" class="progress">
      <el-progress
        type="circle"
        :percentage="nerProgress.percentage"
        :status="nerProgress.status"
      >
        <template #default="{ percentage }">
          <span class="percentage-value">{{ percentage }}%</span><br />
          <span class="percentage-label">Analiza NER</span>
        </template>
      </el-progress>
      <el-progress
        type="circle"
        :percentage="terProgress.percentage"
        :status="terProgress.status"
      >
        <template #default="{ percentage }">
          <span class="percentage-value">{{ percentage }}%</span><br />
          <span class="percentage-label">Analiza TER</span>
        </template>
      </el-progress>
    </el-row>
    <el-row v-if="error" class="progress">
      {{ error }}
    </el-row>
    <el-row type="flex" justify="space-between">
      <el-button
        :disabled="inProgress"
        type="primary"
        plain
        @click="$emit('back')"
      >
        Wstecz
      </el-button>
      <el-button
        :disabled="inProgress || error"
        type="primary"
        @click="$emit('submit')"
      >
        Wyświetl wizualizację
      </el-button>
    </el-row>
  </el-card>
</template>

<style scoped>
.title {
  font-size: 24px;
}
.progress {
  margin-bottom: 24px;
}
</style>

<script lang="ts">
export interface Progress {
  status: string;
  percentage: number;
}

import { defineComponent, PropType } from "vue";
export default defineComponent({
  props: {
    nerProgress: { type: Object as PropType<Progress>, required: true },
    terProgress: { type: Object as PropType<Progress>, required: true },
    inProgress: { type: Boolean, default: false },
    error: { type: Boolean, default: false }
  }
});
</script>
