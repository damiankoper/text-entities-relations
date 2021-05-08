<template>
  <el-container direction="vertical">
    <el-divider style="margin: 0; margin-bottom: -1px" />

    <el-row class="slider" type="flex" align="middle" justify="center">
      <div style="margin:0 16px;">
        <el-switch :value="modelValue.staticOn" @change="onStaticChange">
        </el-switch>
        &nbsp;&nbsp;Statyczny
      </div>

      <div style="flex-grow: 1">
        <el-slider
          style="flex-grow:1"
          :value="modelValue"
          @change="onRangeChange"
          range
          :max="100"
        >
        </el-slider>
      </div>
      <div style="margin:0 16px;">
        <el-select
          :value="modelValue.selectValue"
          placeholder="Select"
          size="mini"
          @change="onSelectChange"
        >
          <el-option
            v-for="item in sliderUnits"
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
import { defineComponent } from "vue";
import { units } from "@/constants/constants";
export default defineComponent({
  name: "Slider",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  methods: {
    onSelectChange(event: any) {
      /*const sliderObject = {
        sliderRange: this.modelValue.sliderRange,
        staticOn: this.modelValue.staticOn,
        selectValue: event
      };*/
      //console.log(sliderObject);
      this.$emit("update:modelValue", event);
      //console.log(sliderObject);
    },
    onRangeChange(event: any) {
      this.$emit("update:modelValue", event);
    },
    onStaticChange(event: any) {
      this.$emit("update:modelValue", event);
    }
  },
  setup() {
    const sliderUnits = [...units];
    return {
      sliderUnits
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
