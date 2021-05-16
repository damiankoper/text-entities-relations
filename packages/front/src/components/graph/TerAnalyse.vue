<template>
  <el-container direction="vertical">
    <ter-params v-model="params" :disabled="terProgress.inProgress" />
    <el-progress
      :text-inside="true"
      :stroke-width="15"
      :percentage="terProgress.percentage"
      :status="terProgress.status"
    ></el-progress>
    <el-row :gutter="16">
      <el-col :span="16">
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
            <el-button
              style="width:100%"
              type="primary"
              plain
              :disabled="terProgress.inProgress"
            >
              Analizuj
            </el-button>
          </template>
        </el-popconfirm>
      </el-col>
      <el-col :span="8">
        <el-button
          style="width:100%"
          type="primary"
          plain
          @click="reset"
          :disabled="terProgress.inProgress"
        >
          Reset
        </el-button>
      </el-col>
    </el-row>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, ref } from "vue";
import {
  units,
  languages,
  defaultProgress,
  Progress
} from "@/common/constants";
import TerParams from "@/components/TerParams.vue";
import { Irs, IrsParams, defaultIrsParams } from "core";
import _ from "lodash";
export default defineComponent({
  emits: ["submit", "reset"],
  props: {
    terProgress: {
      type: Object as PropType<Progress>,
      default: defaultProgress
    },
    irs: {
      type: Object as PropType<Irs>,
      required: false
    }
  },
  components: { TerParams },
  setup(props, { emit }) {
    const params = ref<IrsParams>(defaultIrsParams());

    watch(
      () => props.irs,
      v => {
        if (v) params.value = _.cloneDeep(v.params);
      },
      { immediate: true }
    );

    return {
      params,
      languages,
      units,
      reset() {
        emit("reset");
        if (props.irs) params.value = _.cloneDeep(props.irs.params);
      }
    };
  }
});
</script>
<style scoped lang="scss">
.el-progress {
  margin-bottom: 16px;
}
</style>
