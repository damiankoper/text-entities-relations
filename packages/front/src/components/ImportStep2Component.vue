<template>
  <div class="box">
    <el-row>
      <el-col :span="12">
        <el-row class="row">
          <el-col :span="12">
            <h2>Parametry NER</h2>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            <el-select v-model="value1" placeholder="Język">
              <el-option
                v-for="item in languages"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row class="row">
          <el-col :span="12">
            <h2>Parametry TER</h2>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            <el-input placeholder="Please input" v-model="inputTer1" />
          </el-col>
          <el-col :span="6" :offset="1">
            <el-select v-model="value2" placeholder="Jednostka">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            <el-input placeholder="Please input" v-model="inputTer2" />
          </el-col>
          <el-col :span="6" :offset="1">
            <el-select v-model="value3" placeholder="Jednostka">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <div class="button-content">
      <el-button type="primary" icon="el-icon-arrow-left">
        wstecz
      </el-button>
      <el-button type="primary">
        Rozpocznij analizę
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.box {
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.title {
  text-align: left;
  font-size: 30px;
}
.row {
  margin-top: 10%;
  margin-left: 1%;
}
.button-content {
  margin-top: 10%;
  margin-bottom: 1%;
}
</style>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "ImportStep2Component",
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
      languages: [
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
      value2: "",
      value3: ""
    };
  }
});
</script>
