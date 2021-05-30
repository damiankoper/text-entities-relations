<template>
  <router-view
    @irs="onIrs"
    :irs="irs"
    @hisBack="hisBack"
    @hisForward="hisForward"
  />
</template>

<script lang="ts">
import { defineComponent, ref, provide } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
import { Irs, IrsSerializationService } from "core";
import { useHistory, countersSymbol } from "./composables/useHistory";
export default defineComponent({
  setup() {
    const { push } = useRouter();
    const irs = ref<Irs | null>(null);
    const irsSerializationService = IrsSerializationService.get();
    const { back, forward, add, counters } = useHistory();
    provide(countersSymbol, counters);

    function setTerSession() {
      if (irs.value) {
        localStorage.setItem(
          "terSession",
          irsSerializationService.stringify(irs.value)
        );
        localStorage.setItem("terSessionDate", moment().format());
      }
    }
    return {
      irs,
      onIrs(irsPayload: Irs) {
        // Save old
        if (irs.value) add(irs.value);
        // Set new
        irs.value = irsPayload;
        console.log(irsPayload);

        setTerSession();
        push("graph");
      },
      hisBack() {
        if (irs.value) {
          irs.value = back(irs.value);
          setTerSession();
        }
      },
      hisForward() {
        if (irs.value) {
          irs.value = forward(irs.value);
          setTerSession();
        }
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
