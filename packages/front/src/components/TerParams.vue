<template>
  <h3 class="section-title">Parametry TER</h3>
  <el-container>
    <el-form :disabled="disabled">
      <el-col>
        <el-form-item label="Okno" label-width="80px">
          <el-input-number v-model="params.window" :min="1" />
        </el-form-item>
        <el-form-item label="Overlap" label-width="80px">
          <el-input-number v-model="params.overlap" :min="0" />
        </el-form-item>
        <el-form-item label="Jednostka" label-width="80px">
          <el-select v-model="params.unit" placeholder="Jednostka">
            <el-option
              v-for="item in units"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-form>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, PropType, watchEffect, ref, watch } from "vue";
import { units, languages } from "@/common/constants";
import { TextUnit, IrsParams } from "core";

export default defineComponent({
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Object as PropType<IrsParams>,
      required: true
    },
    disabled: Boolean
  },
  setup(props, { emit }) {
    const params = ref<IrsParams>({
      window: 20,
      overlap: 10,
      unit: TextUnit.SENTENCE
    });

    watchEffect(() => {
      params.value = props.modelValue;
    });

    watch(params, () => emit("update:modelValue", params.value));

    return {
      params,
      languages,
      units
    };
  }
});
</script>
<style scoped>
.section-title {
  margin: 0;
  font-weight: 700;
  margin-bottom: 16px;
}
</style>
