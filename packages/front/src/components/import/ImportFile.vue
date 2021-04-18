<template>
  <el-card class="box-card">
    <template #header>
      <h2 class="title">Dane wejściowe</h2>
    </template>
    <el-row type="flex" justify="center" class="file">
      <el-upload
        :on-change="onFileChange"
        :on-remove="remove"
        :auto-upload="false"
        drag
        action=""
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Przeciągnij tutaj plik lub
          <em>kliknij, aby wybrać.</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            zip, doc, docx, pptx, xlsx, odt, pdf, html, rtf, txt
          </div>
        </template>
      </el-upload>
    </el-row>
    <el-row type="flex" justify="end">
      <el-button :disabled="!file" type="primary" @click="submit"
        >Dalej</el-button
      >
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.title {
  font-size: 24px;
}
.file {
  margin-bottom: 24px;
}
</style>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  emits: ["submit"],
  components: {},
  setup(_, { emit }) {
    const file = ref<File | null>(null);
    return {
      onFileChange({ raw }: { raw: File }) {
        file.value = raw;
        console.log(raw);
      },
      submit() {
        emit("submit", file.value);
      },
      remove() {
        file.value = null;
      },
      file
    };
  }
});
</script>
