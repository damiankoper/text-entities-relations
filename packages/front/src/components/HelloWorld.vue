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
    const nerInterface = NerInterfaceService.get();
    const onProgressUnsub = nerInterface.onProgress.sub((progress: number) => {
      console.log(progress);
    });
    console.log(nerInterface.nestedTestService.test);

    onUnmounted(() => {
      onProgressUnsub();
    });
  }
});
</script>

<style scoped lang="scss"></style>
