<template>
  <el-card class="box-card">
    <template #header>
      <h2 class="title">Analiza</h2>
    </template>
    <el-row type="flex" justify="space-around" class="progress">
      <div class="progress-col">
        <div class="progress-circle">
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
        </div>
        <div class="error" v-if="nerProgress.error">
          >
          {{ nerProgress.error }}
        </div>
      </div>
      <div class="progress-col">
        <div class="progress-circle">
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
        </div>
        <div class="error" v-if="terProgress.error">
          {{ terProgress.error }} asasd
        </div>
      </div>
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
        :disabled="inProgress || terProgress.error || nerProgress.error"
        type="primary"
        @click="$emit('submit')"
        :loading="inProgress || terProgress.error || nerProgress.error"
      >
        Wyświetl wizualizację
      </el-button>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.title {
  margin: 0;
}
.progress {
  margin-bottom: 24px;
  &-col {
    width: 50%;
  }
  &-circle {
    display: flex;
    justify-content: center;
  }
  .error {
    margin: 24px 0 0 0;
  }
}
</style>

<script lang="ts">
export interface Progress {
  status: "" | "success" | "warning" | "exception";
  percentage: number;
  error: null | string;
}

import { defineComponent, PropType } from "vue";
export default defineComponent({
  props: {
    nerProgress: { type: Object as PropType<Progress>, required: true },
    terProgress: { type: Object as PropType<Progress>, required: true },
    inProgress: { type: Boolean, default: false }
  }
});
</script>
