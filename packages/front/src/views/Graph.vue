<template>
  <el-container direction="vertical">
    <Header showGraphOptions />
    <el-container>
      <el-main class="graph">
        <GraphComponent v-model="slider" />
      </el-main>
      <el-aside class="aside-bar">
        <GraphOptions
          :terProgress="progress"
          :irs="irs"
          @submitTer="onTerSubmit"
          @resetTer="onTerReset"
        />
      </el-aside>
    </el-container>
    <Slider v-model="slider" />
    <Footer />
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from "vue";
import GraphComponent from "@/components/graph/GraphComponent.vue";
import Header from "@/components/Header.vue";
import Slider from "@/components/graph/Slider.vue";
import GraphOptions from "@/components/graph/GraphOptions.vue";
import Footer from "@/components/Footer.vue";
import { TextUnit, Irs, IrsParams } from "core";
import { useRouter } from "vue-router";
import { useTer } from "@/composables/useTer";
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

  props: {
    irs: {
      type: Object as PropType<Irs>,
      required: false
    }
  },
  setup(props, { emit }) {
    const { progress, irs, analyse, resetProgress } = useTer();

    const slider = ref<SliderData>({
      sliderRange: [0, 100],
      isStatic: true,
      unit: TextUnit.CHUNK
    });

    const { push } = useRouter();
    onMounted(() => {
      console.log(props.irs);
      if (!props.irs) push("/");
    });

    return {
      slider,
      progress,
      async onTerSubmit(p: IrsParams) {
        resetProgress();
        if (props.irs) {
          await analyse(props.irs?.document, p);
          emit("irs", irs.value);
        }
      },
      onTerReset() {
        resetProgress();
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
