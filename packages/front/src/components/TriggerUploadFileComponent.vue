<template>
  <el-upload
    class="upload-demo"
    drag
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :file-list="fileList"
    multiple
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">
      Należy przeciągnąć plik/link lub wpisać/wkleić tekst <br />(pliki doc,
      docx, pptx, xlsx, odt, pdf, html, rtf zostaną <br />automatycznie
      przekonwertowane do tekstu), <br />rozmiar tekstu jest ograniczony
    </div>
    <!-- <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template> -->
  </el-upload>
</template>

<style></style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TriggerUploadFileComponent",
  methods: {
    handlePreview() {
      //
    },
    handleRemove() {
      //
    }
  },
  data() {
    return {
      fileList: []
    };
  }
});
</script>
