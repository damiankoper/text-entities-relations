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
        :limit="1"
        :on-exceed="handleExceed"
        :multiple="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Przeciągnij tutaj plik lub
          <em>kliknij, aby wybrać.</em>
        </div>
        <template #tip>
          <div class="el-upload__tip text-wrap">
            <p v-if="exceededLimit" class="danger">
              Możesz załączyć tylko jeden plik/archiwum!<br /><br />
              Jeśli chcesz wybrać inny plik, usuń najpierw obecny.<br /><br />Aby
              przeanalizować wiele plików spakuje je w archiwum i zaimportuj.
            </p>
            Niektóre z dostępnych formatów: zip, doc, docx, pptx, xlsx, odt,
            pdf,<br />
            html, rtf, txt
          </div>
        </template>
      </el-upload>
    </el-row>
    <el-row type="flex" justify="end">
      <el-button :disabled="!file" type="primary" @click="submit">
        Dalej
      </el-button>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.title {
  margin: 0;
}
.file {
  margin-bottom: 24px;
}
.danger {
  color: #f56c6c;
}
</style>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  emits: ["submit"],
  components: {},
  setup(_, { emit }) {
    const file = ref<File | null>(null);
    const exceededLimit = ref(false);
    return {
      onFileChange({ raw }: { raw: File }) {
        file.value = raw;
        exceededLimit.value = false;
      },
      submit() {
        emit("submit", file.value);
      },
      remove() {
        file.value = null;
        exceededLimit.value = false;
      },
      handleExceed() {
        exceededLimit.value = true;
      },
      file,
      exceededLimit
    };
  }
});
</script>
