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

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { Language } from "core";

export interface Params {
  ner: { lang: Language };
  ter: { window: number; overlap: number; unit: string };
}

export enum TextUnit {
  WORD = "word",
  SENTENCE = "sentence",
  CHUNK = "chunk"
}

export default defineComponent({
  emits: ["submit", "back"],
  setup() {
    const params = reactive({
      ner: {
        lang: Language.PL
      },
      ter: {
        window: 20,
        overlap: 10,
        unit: TextUnit.SENTENCE
      }
    });

    return {
      params,
      languages: [
        { value: Language.PL, label: "Polski" },
        { value: Language.EN, label: "Angielski" },
        { value: Language.DE, label: "Niemiecki" },
        { value: Language.ES, label: "Hiszpański" },
        { value: Language.RU, label: "Rosyjski" }
      ],
      units: [
        { value: TextUnit.CHUNK, label: "Paragraf" },
        { value: TextUnit.SENTENCE, label: "Zdanie" },
        { value: TextUnit.WORD, label: "Słowo" }
      ]
    };
  }
});
</script>
