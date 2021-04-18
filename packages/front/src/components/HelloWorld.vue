<template> xx </template>

<script lang="ts">
import { defineComponent, onUnmounted } from "vue";
import { NerInterfaceService } from "core";
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String
  },
  setup() {
    const nerInterface = new NerInterfaceService();
    const onProgressUnsub = nerInterface.onProgress.sub((progress: number) => {
      console.log(progress);
    });

    onUnmounted(() => {
      onProgressUnsub();
    });
  }
});
</script>

<style scoped lang="scss"></style>
