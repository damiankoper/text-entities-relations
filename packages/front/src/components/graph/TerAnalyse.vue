<template>
  <el-container direction="vertical">
    <ter-params v-model="params" />
    <el-progress
      :text-inside="true"
      :stroke-width="15"
      :percentage="terProgress.percentage"
      :status="terProgress.status"
    ></el-progress>
    <el-popconfirm
      confirmButtonText="OK"
      cancelButtonText="Anuluj"
      hideIcon
      confirmButtonType="info"
      cancelButtonType="info"
      title="Wszystkie zmiany zostaną nadpisane!"
      @confirm="$emit('submit', params)"
    >
      <template #reference>
        <el-button type="primary" plain>
          Ponów analizę
        </el-button>
      </template>
    </el-popconfirm>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from "vue";
import { units, languages } from "@/common/constants";
import TerParams, { TerParamsObj } from "@/components/TerParams.vue";
import { TextUnit } from "core";

export interface Progress {
  status: "" | "success" | "warning" | "exception";
  percentage: number;
  error: null | string;
}
export default defineComponent({
  emits: ["submit"],
  props: {
    terProgress: {
      type: Object as PropType<Progress>,
      default: () => ({})
    },
    inProgress: {
      type: Boolean,
      default: false
    }
  },
  components: { TerParams },
  setup() {
    // todo: get params from IRS
    const params = reactive<TerParamsObj>({
      window: 20,
      overlap: 10,
      unit: TextUnit.SENTENCE
    });

    return { params, languages, units };
  }
});
</script>
<style scoped lang="scss">
.el-progress {
  margin-bottom: 16px;
}
</style>
