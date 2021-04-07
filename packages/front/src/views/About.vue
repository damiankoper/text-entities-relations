<template>
  <el-container>
    <el-header class="header-content">
      <HeaderComponent />
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
  <FooterComponent />
</template>

<style scoped>
.header-content {
  padding: 0px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import FooterComponent from "@/components/FooterComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

export default defineComponent({
  name: "About",
  components: {
    FooterComponent,
    HeaderComponent
  }
});
</script>
