<template>
  <el-container direction="vertical">
    <el-divider style="margin: 0; margin-bottom: -1px" />

    <el-row class="slider" type="flex" align="middle" justify="center">
      <div style="margin:0 16px;">
        <el-switch v-model="staticOn"> </el-switch>
        &nbsp;&nbsp;Statyczny
      </div>

      <div style="flex-grow: 1">
        <el-slider style="flex-grow:1" v-model="sliderRange" range :max="100">
        </el-slider>
      </div>
      <div style="margin:0 16px;">
        <el-select v-model="value" placeholder="Select" size="mini">
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
import { sliderUnits } from "@/constants/constants";
export default defineComponent({
  name: "Slider",
  props: {
    sliderMinValue: Number,
    sliderMaxValue: Number
  },
  data() {
    return {
      sliderRange: [this.sliderMinValue, this.sliderMaxValue],
      staticOn: true,
      sliderUnits: [...sliderUnits],
      value: ""
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
