<template>
  <el-container direction="vertical">
    <Header showGraphOptions />
    <el-container>
      <el-main class="graph">
        <GraphComponent v-model="slider" />
      </el-main>
      <el-aside class="aside-bar">
        <GraphOptions
          :terProgress="terProgress"
          :inProgress="inProgress"
          @submit="onParamsSubmit"
        />
      </el-aside>
    </el-container>
    <Slider v-model="slider" />
    <Footer />
  </el-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from "vue";
import GraphComponent from "@/components/graph/GraphComponent.vue";
import Header from "@/components/Header.vue";
import Slider from "@/components/graph/Slider.vue";
import GraphOptions from "@/components/graph/GraphOptions.vue";
import Footer from "@/components/Footer.vue";
import { TerParamsObj } from "@/components/TerParams.vue";
import { TextUnit } from "@/common/constants";
import { Progress } from "@/components/import/ImportAnalyse.vue";
export interface SliderData {
  sliderRange: [number, number];
  isStatic: boolean;
  unit: TextUnit;
}
export default defineComponent({
  name: "Graph",
  components: {
    GraphComponent,
    Header,
    Slider,
    GraphOptions,
    Footer
  },

  setup() {
    const terProgress = reactive<Progress>({
      status: "",
      percentage: 0,
      error: null
    });
    const inProgress = ref(false);
    const params = ref<TerParamsObj | null>(null);

    const slider = ref<SliderData>({
      sliderRange: [0, 100],
      isStatic: true,
      unit: TextUnit.CHUNK
    });

    onMounted(() => {
      // todo: if irs from props =undefined route= /home
    });

    return {
      terProgress,
      inProgress,
      slider,
      async onParamsSubmit(p: TerParamsObj) {
        terProgress.percentage = 0;
        inProgress.value = true;
        params.value = p;
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.graph {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: calc(
    100vh - 52px - 40px - 32px
  ); // 100% - header - slider - footer
}
.aside-bar {
  overflow: visible;
}
</style>
