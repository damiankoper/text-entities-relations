<template>
  <router-view @irs="onIrs" :irs="irs" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { compressToUTF16 } from "lz-string";
import moment from "moment";
import { Irs, IrsSerializationService } from "core";

export default defineComponent({
  name: "App",
  setup() {
    const { push } = useRouter();
    const irs = ref<Irs | null>(null);
    const irsSerializationService = IrsSerializationService.get();

    return {
      irs,
      onIrs(irsPayload: Irs) {
        irs.value = irsPayload;
        try {
          localStorage.setItem(
            "terSession",
            compressToUTF16(irsSerializationService.stringify(irsPayload))
          );
          localStorage.setItem("terSessionDate", moment().format());
        } catch (err) {
          console.log("Błąd zapisu do localstorage:\n" + err);
        }
        push("graph");
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
