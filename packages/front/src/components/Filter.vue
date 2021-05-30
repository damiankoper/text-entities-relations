<template>
  <el-form>
    <el-container direction="vertical">
      <el-form-item label="Nazwa" label-width="120px">
        <el-select
          no-data-text="Wpisz nazwę"
          multiple
          filterable
          allow-create
          default-first-option
          v-model="params.name.values"
          placeholder="Nazwa wierzchołka"
        >
        </el-select>
      </el-form-item>
      <el-form-item label="Max. odległość" label-width="120px">
        <el-input-number v-model="params.name.maxDistance" :min="0" />
      </el-form-item>
      <el-divider />
      <el-form-item label="Min. waga" label-width="120px">
        <el-input-number v-model="params.minWeight" :min="0" />
      </el-form-item>
      <el-row :gutter="16" type="flex" justify="end">
        <el-col :span="8">
          <el-button style="width: 100%" type="primary" @click="reset" plain>
            Reset
          </el-button>
        </el-col>
      </el-row>
    </el-container>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watchEffect, watch } from "vue";
import { defaultFilterParams, FilterParams } from "core";
export default defineComponent({
  name: "Filter",
  props: {
    modelValue: {
      type: Object as PropType<FilterParams>,
      required: true
    }
  },
  setup(props, { emit }) {
    const params = ref<FilterParams>(defaultFilterParams());
    watchEffect(() => (params.value = props.modelValue));
    watch(params, () => emit("update:modelValue", params.value), {
      deep: true
    });

    return {
      params,
      reset() {
        emit("update:modelValue", defaultFilterParams());
      }
    };
  }
});
</script>

<style scoped></style>
