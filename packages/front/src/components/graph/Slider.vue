<template>
  <el-container direction="vertical">
    <el-divider style="margin: 0; margin-bottom: -1px" />

    <el-row class="slider" type="flex" align="middle" justify="center">
      <div style="margin:0 16px;">
        <el-switch v-model="switchValue"> </el-switch>
        &nbsp;&nbsp;Statyczny
      </div>

      <div style="flex-grow: 1">
        <el-slider style="flex-grow:1" v-model="sliderValues" range :max="100">
        </el-slider>
      </div>
      <div style="margin:0 16px;">
        <el-select v-model="value" placeholder="Select" size="mini">
          <el-option
            v-for="item in options"
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

<style lang="scss" scoped>
.slider {
  margin: 0 0 !important;
  height: 40px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Slider",
  props: {},
  data() {
    return {
      sliderValues: [14, 38],
      switchValue: true,
      options: [
        {
          value: "Option1",
          label: "Option1"
        },
        {
          value: "Option2",
          label: "Option2"
        },
        {
          value: "Option3",
          label: "Option3"
        },
        {
          value: "Option4",
          label: "Option4"
        },
        {
          value: "Option5",
          label: "Option5"
        }
      ],
      value: ""
    };
  }
});
</script>
