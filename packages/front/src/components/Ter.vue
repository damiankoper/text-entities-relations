<template>
  <div class="box">
    <div class="box-content">
      <h2 class="title">Parametry TER</h2>
      <el-container class="button-content">
        <el-col :span="12">
          <el-row>
            <el-input placeholder="Okno" v-model="inputTer1" />
          </el-row>
          <el-row>
            <el-input placeholder="Overlap" v-model="inputTer2" />
          </el-row>
          <el-row>
            <el-button type="primary">
              Ponów analizę
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-select v-model="value1" placeholder="Jednostka">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
          <el-row>
            <el-select v-model="value2" placeholder="Jednostka">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
        </el-col>
      </el-container>
    </div>
  </div>
</template>

<style scoped>
.box {
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;
}
.box-content {
  width: 95%;
}
.box .el-button {
  width: 100%;
}
.button-content {
  width: 100%;
  margin: auto 0;
}
.title {
  text-align: left;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "Ter",
  props: {},
  data() {
    return {
      inputTer1: ref("Okno"),
      inputTer2: ref("Overlap"),
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
      value1: "",
      value2: ""
    };
  }
  //   methods: {
  //     }
  //   }
});
</script>
