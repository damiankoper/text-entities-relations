<template>
  <div class="box">
    <h2 class="title">Parametry TER</h2>
    <el-container>
      <el-col :span="16">
        <el-row :offset="1">
          <el-input placeholder="Okno" v-model="inputTer1" />
        </el-row>
        <el-row :offset="1">
          <el-input placeholder="Overlap" v-model="inputTer2" />
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-row :offset="1">
          <el-select v-model="value1" placeholder="Jednostka">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-row>
        <el-row :offset="1">
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
    <el-popconfirm
      confirmButtonText="OK"
      cancelButtonText="Cancel"
      hideIcon
      confirmButtonType="info plane"
      cancelButtonType="info plane"
      title="Wszystkie zmiany zostaną nadpisane!"
    >
      <template #reference>
        <el-button type="primary" plain>
          Ponów analizę
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<style scoped>
.box {
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  padding-right: 5px;
}

.box .el-button {
  margin-top: 5px;
  margin-right: 10px;
  width: 100%;
}
.box .el-input {
  margin-right: 5px;
  margin-bottom: 5px;
}

.box .el-select {
  margin-bottom: 5px;
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
