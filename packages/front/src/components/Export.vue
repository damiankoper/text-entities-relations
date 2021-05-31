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
    <el-button @click="onGephiExport" type="primary" plain>
      Pobierz GEPHI
    </el-button>
    <el-button @click="onCsvExport" type="primary" plain>
      Pobierz CSV
    </el-button>
    <a ref="anchorElem" download />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import moment from "moment";
import {
  Irs,
  IrsSerializationService,
  CSVExporter,
  GEXFExporter,
  Graph
} from "core";
import { useDownloadLink } from "@/composables/useDownloadLink";

export default defineComponent({
  name: "Export",

  props: {
    irs: {
      type: Object as PropType<Irs | undefined>,
      required: false
    },
    graph: {
      type: Object as PropType<Graph | undefined>,
      required: false
    }
  },

  setup(props) {
    const csvExporter = CSVExporter.get();
    const gexfeExporter = GEXFExporter.get();
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

    const onCsvExport = () => {
      if (props.graph) {
        const graphCsv = csvExporter.exportCSV(props.graph);
        downloadBlob(
          graphCsv,
          `save-${moment().format("YYYY_MM_DD_HH_mm")}.csv`
        );
      }
    };

    const onGephiExport = () => {
      if (props.graph) {
        const graph = gexfeExporter.exportGEXF(props.graph);
        downloadBlob(graph, `save-${moment().format("YYYY_MM_DD_HH_mm")}.gexf`);
      }
    };

    return { anchorElem, onTerExport, onCsvExport, onGephiExport };
  }
});
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 4px;
  .el-button {
    margin: 4px 2px;
    width: 100%;
  }
}
</style>
