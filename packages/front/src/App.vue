<template>
  <router-view
    @irs="onIrs"
    :irs="irs"
    @hisBack="hisBack"
    @hisForward="hisForward"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { Irs, IrsSerializationService } from "core";
import { useHistory } from "./composables/useHistory";

export default defineComponent({
  name: "App",
  setup() {
    const { push } = useRouter();
    const irs = ref<Irs | null>(null);
    const irsSerializationService = IrsSerializationService.get();
    const { back, forward, add } = useHistory();
    return {
      irs,
      onIrs(irsPayload: Irs) {
        irs.value = irsPayload;
        add(irs.value);
        localStorage.setItem(
          "terSession",
          irsSerializationService.stringify(irsPayload)
        );
        push("graph");
      },
      hisBack() {
        if (irs.value) irs.value = back(irs.value);
      },
      hisForward() {
        if (irs.value) irs.value = forward(irs.value);
      }
    };
  }
});
</script>

<style>
#app,
body {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #606266;
  margin: 0;
}
</style>
