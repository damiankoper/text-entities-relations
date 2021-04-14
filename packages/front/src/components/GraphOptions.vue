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

    <Ter v-if="activeIndex == 1" />
    <Filter v-if="activeIndex == 2" />
    <Export v-if="activeIndex == 3" />
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
import Export from "@/components/Export.vue";
import Ter from "@/components/Ter.vue";
import Filter from "@/components/Filter.vue";
export default defineComponent({
  name: "GraphOptions",
  components: {
    Ter,
    Export,
    Filter
  },
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
      this.activeIndex = key;
    }
  }
});
</script>
