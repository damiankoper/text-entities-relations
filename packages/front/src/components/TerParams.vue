<template>
  <div class="box">
    <h2 class="title">Parametry TER</h2>
    <el-container>
      <el-form>
        <el-col>
          <el-form-item label="Okno" label-width="80px">
            <el-input-number v-model="params.ter.window" :min="1" />
          </el-form-item>
          <el-form-item label="Overlap" label-width="80px">
            <el-input-number v-model="params.ter.overlap" :min="0" />
          </el-form-item>
          <el-form-item label="Jednostka" label-width="80px">
            <el-select v-model="params.ter.unit" placeholder="Jednostka">
              <el-option
                v-for="item in units"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-container>
    <el-progress
      :text-inside="true"
      :stroke-width="15"
      :percentage="terProgress.percentage"
      :status="terProgress.status"
    ></el-progress>
    <el-popconfirm
      confirmButtonText="OK"
      cancelButtonText="Cancel"
      hideIcon
      confirmButtonType="info"
      cancelButtonType="info"
      title="Wszystkie zmiany zostaną nadpisane!"
      @confirm="$emit('submit', params)"
    >
      <template #reference>
        <el-button type="primary" plain>
          Ponów analizę
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { units, TextUnit, languages } from "@/constants/constants";

export interface Params {
  ter: { window: number; overlap: number; unit: string };
}

export interface Progress {
  status: "" | "success" | "warning" | "exception";
  percentage: number;
  error: null | string;
}
export default defineComponent({
  name: "TerParams",
  emits: ["submit"],
  props: {
    terProgress: { type: Object as PropType<Progress>, default: () => ({}) },
    inProgress: { type: Boolean, default: false }
  },
  methods: {},
  setup() {
    const params = reactive({
      ter: {
        window: 20,
        overlap: 10,
        unit: TextUnit.SENTENCE
      }
    });

    return {
      params,
      inputTer1: ref("Okno"),
      inputTer2: ref("Overlap"),
      languages: [...languages],
      units: [...units]
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
