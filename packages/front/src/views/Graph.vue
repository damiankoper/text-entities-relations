<template>
  <el-container>
    <el-header class="header-content">
      <HeaderComponent />
    </el-header>
    <el-container>
      <el-container>
        <el-main>
          <GraphComponent />
        </el-main>
        <el-aside width="300px">
          <GraphOptionsComponent />
        </el-aside>
      </el-container>
    </el-container>
    <SliderComponent />
    <FooterComponent />
  </el-container>
</template>

<style scoped>
.header-content {
  padding: 0px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import GraphComponent from "@/components/GraphComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import SliderComponent from "@/components/SliderComponent.vue";
import GraphOptionsComponent from "@/components/GraphOptionsComponent.vue";

export default defineComponent({
  name: "Graph",
  components: {
    GraphComponent,
    FooterComponent,
    HeaderComponent,
    SliderComponent,
    GraphOptionsComponent
  }
});
</script>
