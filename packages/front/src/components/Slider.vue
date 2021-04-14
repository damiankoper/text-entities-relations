<template>
  <div class="box">
    <el-row :gutter="15">
      <el-col :span="4">
        <el-switch
          v-model="switchValue"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
        Statyczny
      </el-col>
      <el-col :span="16"
        ><el-slider v-model="sliderValues" range :max="100"></el-slider
      ></el-col>
      <el-col :span="4"
        ><el-select v-model="value" placeholder="Select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
      ></el-col>
    </el-row>
  </div>
</template>

<style>
.box {
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
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
