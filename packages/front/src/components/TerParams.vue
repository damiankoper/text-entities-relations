<template>
  <h3 class="section-title">Parametry TER</h3>
  <el-container>
    <el-form :disabled="disabled">
      <el-col>
        <el-form-item label="Okno" label-width="120px">
          <el-input-number v-model="params.window" :min="1" />
        </el-form-item>
        <el-form-item label="Overlap" label-width="120px">
          <el-input-number
            v-model="params.overlap"
            :min="0"
            :max="params.window - 1"
          />
        </el-form-item>
        <el-form-item
          label="Jednostka"
          label-width="120px"
          style="max-width:400px"
        >
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
        <el-form-item
          label="Typy tokenów"
          label-width="120px"
          style="max-width:400px"
        >
          <el-select multiple v-model="params.types" placeholder="Typy tokenów">
            <el-option
              v-for="item in tokenTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <h4 class="section-title">Post process</h4>
        <el-tooltip placement="left">
          <template #content>
            <div style="max-width:250px">
              Scal wierzchołki, pomiędzy którymi odległość Levenshteina nie
              przekszacza podanej liczby.
            </div>
          </template>
          <el-form-item label="Scal podobne" label-width="120px">
            <el-input-number v-model="params.post.maxMergeDistance" :min="0" />
          </el-form-item>
        </el-tooltip>
        <el-tooltip placement="left">
          <template #content>
            <div style="max-width:250px">
              Usuń wierzchołki, które mają tyle samo lub więcej relacji niż
              podana liczba.
            </div>
          </template>
          <el-form-item label="Minimum relacji" label-width="120px">
            <el-input-number v-model="params.post.minRelations" :min="0" />
          </el-form-item>
        </el-tooltip>
        <el-tooltip placement="left">
          <template #content>
            <div style="max-width:250px">
              Usuń wierzchołki, których nazwa to liczba.
            </div>
          </template>
          <el-form-item label="Usuń liczby" label-width="120px">
            <el-checkbox v-model="params.post.excludeNumbers" />
          </el-form-item>
        </el-tooltip>
      </el-col>
    </el-form>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, PropType, watchEffect, ref, watch } from "vue";
import { units, languages, tokenTypes } from "@/common/constants";
import { IrsParams, defaultIrsParams } from "core";

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
    const params = ref<IrsParams>(defaultIrsParams());

    watchEffect(() => {
      params.value = props.modelValue;
    });

    watch(params, () => {
      emit("update:modelValue", params.value);
    });

    watch(
      params,
      () => {
        params.value.overlap = Math.min(
          params.value.window - 1,
          params.value.overlap
        );
      },
      { deep: true }
    );

    return {
      params,
      languages,
      units,
      tokenTypes
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
