<template>
  <el-container>
    <el-header class="header-content">
      <Header />
    </el-header>
    <el-main>
      <div class="about">
        <h1>This is an about page</h1>
        <h3>Damian</h3>
        <h3>Leszek</h3>
        <h3>Mateusz</h3>
        <h3>Karol</h3>
        <h3>Michał</h3>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.header-content {
  padding: 0px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "About",
  components: {
    Header
  }
});
</script>
