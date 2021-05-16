<template>
  <div class="box">
    <el-tooltip
      class="item"
      effect="dark"
      content="Format pozwala na wczytanie danych z powrotem do aplikacji i kontynuowanie pracy"
      placement="left"
    >
      <el-button @click="onTerExport" type="primary" plain>
        Pobierz TER
      </el-button>
    </el-tooltip>
    <el-button type="primary" plain>Pobierz GEPHI</el-button>
    <el-button type="primary" plain>Pobierz CSV</el-button>
    <a ref="anchorElem" download />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import moment from "moment";
import { Irs, IrsSerializationService } from "core";
import { useDownloadLink } from "@/composables/useDownloadLink";

export default defineComponent({
  name: "Export",

  props: {
    irs: {
      type: Object as PropType<Irs | undefined>,
      required: false
    }
  },

  setup(props) {
    const irsSerializationService = IrsSerializationService.get();
    const { anchorElem, downloadBlob } = useDownloadLink();

    const onTerExport = () => {
      if (props.irs) {
        const irsJson = irsSerializationService.stringify(props.irs);
        downloadBlob(
          irsJson,
          `save-${moment().format("YYYY_MM_DD_HH_mm")}.ter`
        );
      }
    };

    return { anchorElem, onTerExport };
  }
});
</script>

<style lang="scss" scoped>
.box {
  flex-direction: column;
  align-items: center;
  padding-right: 4px;
  .el-button {
    margin: 5px 2px;
    width: 100%;
  }
}
</style>
