<template>
  <div class="box">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      style="padding: revert"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1" :span="8">TER</el-menu-item>
      <el-menu-item index="2" :span="8">Filtry</el-menu-item>
      <el-menu-item index="3" :span="8">Eksport</el-menu-item>
    </el-menu>
    <ExportComponent />
    <TerComponent />
    <FilterComponent />
  </div>
</template>

<style>
.box {
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import ExportComponent from "@/components/ExportComponent.vue";
import TerComponent from "@/components/TerComponent.vue";
import FilterComponent from "@/components/FilterComponent.vue";
export default defineComponent({
  components: {
    TerComponent,
    ExportComponent,
    FilterComponent
  },
  name: "GraphOptionsComponent",
  props: {
    nodes: Array
  },
  data() {
    return {
      activeIndex: "1"
    };
  },
  methods: {
    handleSelect(key: string, keyPath: string) {
      console.log(key, keyPath);
    }
  }
});
</script>
