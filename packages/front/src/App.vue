<template>
  <router-view @irs="onIrs" :irs="irs" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
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
          // TODO Damian usuń
          const json = irsSerializationService.stringify(irsPayload);
          const file = new Blob([json], { type: "text/plain" });
          console.log("Wynik TER:\n" + URL.createObjectURL(file));

          // TODO dodać kompresję przed localstorage
          localStorage.setItem(
            "terSession",
            irsSerializationService.stringify(irsPayload)
          );
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
