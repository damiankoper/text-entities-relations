<template>
  <el-card class="box-card">
    <template #header>
      <h2 class="title">Parametry</h2>
    </template>
    <el-form>
      <el-row class="row">
        <el-col :span="12">
          <h3 class="section-title">Parametry NER</h3>
          <el-form-item label="Język">
            <el-select v-model="params.ner.lang" placeholder="Język">
              <el-option
                v-for="item in languages"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <ter-params v-model="params.ter" />
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="space-between">
      <el-button type="primary" plain @click="$emit('back')">
        Wstecz
      </el-button>
      <el-button type="primary" @click="$emit('submit', params)">
        Analizuj
      </el-button>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

import { units, languages, NerParams } from "@/common/constants";
import { Language, IrsParams, defaultIrsParams } from "core";
import TerParams from "../TerParams.vue";

export interface Params {
  ner: NerParams;
  ter: IrsParams;
}

export default defineComponent({
  emits: ["submit", "back"],
  components: { TerParams },
  setup() {
    const params = reactive({
      ner: {
        lang: Language.PL
      },
      ter: defaultIrsParams()
    } as Params);

    return {
      params,
      languages,
      units
    };
  }
});
</script>

<style lang="scss" scoped>
.title {
  margin: 0;
}
.section-title {
  margin: 0;
  font-weight: 700;
  margin-bottom: 16px;
}
.el-col {
  margin-bottom: 24px;
}
</style>
