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
          <h3 class="section-title">Parametry TER</h3>
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

<style lang="scss" scoped>
.title {
  font-size: 24px;
}
.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}
.el-col {
  margin-bottom: 24px;
}
</style>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export interface Params {
  ner: { lang: string };
  ter: { window: number; overlap: number; unit: string };
}

export default defineComponent({
  emits: ["submit", "back"],
  setup() {
    const params = reactive({
      ner: {
        lang: "pl"
      },
      ter: {
        window: 20,
        overlap: 10,
        unit: "sentence"
      }
    });

    return {
      params,
      languages: [
        // TODO: Enumy od Mateusza
        { value: "pl", label: "Polski" },
        { value: "en", label: "Angielski" },
        { value: "de", label: "Niemiecki" },
        { value: "es", label: "Hiszpański" }
      ],
      units: [
        { value: "chunk", label: "Paragraf" },
        { value: "sentence", label: "Zdanie" },
        { value: "word", label: "Słowo" }
      ]
    };
  }
});
</script>
