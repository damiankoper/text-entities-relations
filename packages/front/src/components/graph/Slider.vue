<template>
  <el-container direction="vertical">
    <el-divider style="margin: 0; margin-bottom: -1px" />

    <el-row class="slider" type="flex" align="middle" justify="center">
      <div style="margin:0 16px;">
        <el-switch v-model="isStatic"> </el-switch>
        &nbsp;&nbsp;Statyczny
      </div>

      <div style="flex-grow: 1">
        <el-slider
          :disabled="isStatic"
          style="flex-grow:1"
          v-model="slider"
          range
          :max="limits.max"
          :min="limits.min"
        >
        </el-slider>
      </div>
      <div style="margin:0 16px;">
        <el-select
          :disabled="isStatic"
          v-model="unit"
          placeholder="Select"
          size="mini"
        >
          <el-option
            v-for="item in units"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </el-row>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect, watch } from "vue";
import { units } from "@/common/constants";
import { SliderData } from "@/views/Graph.vue";
import { TextUnit } from "core";
import _ from "lodash";
export default defineComponent({
  name: "Slider",
  props: {
    modelValue: {
      type: Object as PropType<SliderData>,
      required: true
    },
    limits: {
      type: Object as PropType<{ min: number; max: number }>,
      required: true
    }
  },
  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const slider = ref([0, 100]);
    watchEffect(() => (slider.value = props.modelValue.sliderRange));
    const unit = ref(TextUnit.WORD);
    watchEffect(() => (unit.value = props.modelValue.unit));
    const isStatic = ref(true);
    watchEffect(() => (isStatic.value = props.modelValue.isStatic));

    watch([unit, isStatic], () =>
      emit("update:modelValue", {
        sliderRange: [...slider.value],
        isStatic: isStatic.value,
        unit: unit.value
      })
    );
    watch(
      slider,
      _.debounce((n, o) => {
        if (!_.isEqual(n, o))
          emit("update:modelValue", {
            sliderRange: [...slider.value],
            isStatic: isStatic.value,
            unit: unit.value
          });
      }, 500)
    );

    return {
      slider,
      units,
      unit,
      isStatic
    };
  }
});
</script>

<style lang="scss" scoped>
.slider {
  margin: 0 0 !important;
  height: 40px;
}
</style>
