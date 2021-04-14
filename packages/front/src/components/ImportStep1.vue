<template>
  <div class="box">
    <div class="box-content">
      <h2 class="title">Plik</h2>
      <div class="button-content">
        <el-button @click="dialogVisible = true">
          Wybierz plik
        </el-button>
        <el-dialog v-model="dialogVisible" :before-close="handleClose">
          <TriggerUploadFile />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;
}
.box-content {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.button-content {
  margin: auto 0;
}
.title {
  margin-left: 20px;
  text-align: left;
  font-size: 30px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import TriggerUploadFile from "@/components/TriggerUploadFile.vue";
export default defineComponent({
  name: "ImportStep1",
  components: {
    TriggerUploadFile
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    handleClose(done: Function) {
      // this.$confirm("Are you sure to close this dialog?")
      //   .then(_ => {
      done();
      //     this.dialogVisible = false;
      //   })
      //   .catch(_ => {});
    }
  }
});
</script>
