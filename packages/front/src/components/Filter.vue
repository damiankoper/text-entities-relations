<template>
  <div class="box">
    <el-select v-model="name" debounce="2000" placeholder="Nazwa wierzchołka">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-input
      placeholder="Minimalna liczba wystąpień"
      v-model="input"
      debounce="2000"
    />
    <el-button type="primary" @click="resetValues()" plain>Resetuj</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Filter",
  props: {},
  methods: {
    resetValues() {
      this.input = ref("");
      this.name = "";
    }
  },
  data() {
    return {
      input: ref(""),
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
      name: ""
    };
  }
});
</script>

<style scoped>
.box {
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 5px;
}
.box .el-button {
  margin: 5px 2px;
  width: 100%;
}
.box .el-select {
  margin: 5px 2px;
  width: 100%;
}
.box .el-input {
  margin: 5px 2px;
  width: 100%;
}
</style>
