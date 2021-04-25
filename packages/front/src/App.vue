<template>
  <router-view @irs="onIrs" :irs="irs" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "App",
  setup() {
    const irs = ref<any>(null); // TODO: type IRS
    const { push } = useRouter();

    // TODO: Handle IRS from localstorage here
    // IRS resolve circular references
    //
    // TODO: Handle IRS from localstorage here

    return {
      irs,
      // TODO: type IRS
      onIrs(irsPayload: any) {
        irs.value = irsPayload;

        // TODO: IRS resolve circular references
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
