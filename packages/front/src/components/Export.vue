<template>
  <div class="box">
    <el-button>Pobierz TER</el-button>
    <el-button>Pobierz GEPHI</el-button>
    <el-button>Pobierz CSV</el-button>
  </div>
</template>

<style scoped>
.box {
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box .el-button {
  margin: 5px 2px;
  width: 100%;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Export"
});
</script>
