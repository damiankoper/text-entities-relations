<template>
  <el-container direction="vertical">
    <el-main class="home">
      <el-row :gutter="24" align="middle" class="logo">
        <el-col :span="8">
          <el-image :src="logoImg" />
        </el-col>
        <el-col :span="16" class="logo-text">
          <div>TER</div>
          <div>Analyse the shit out of your books</div>
        </el-col>
      </el-row>
      <el-row :gutter="24" align="middle">
        <el-col :span="12">
          <router-link to="import">
            <el-button class="home-button" @click="$router.push('import')">
              Importuj plik tekstowy
            </el-button>
          </router-link>
        </el-col>
        <el-col :span="12">
          <el-button
            class="home-button"
            @click="terFileInput ? terFileInput.click() : null"
          >
            Importuj z pliku *.ter
          </el-button>
        </el-col>
        <el-col :span="24">
          <el-button
            :disabled="!terSession"
            class="home-button"
            @click="terSessionRestore"
          >
            Przywróć poprzednią sesję{{ terSessionNotification }}
          </el-button>
        </el-col>
      </el-row>
    </el-main>
    <Footer />
    <input
      ref="terFileInput"
      type="file"
      @input="onTerFile"
      accept=".ter"
      style="display:none"
    />
  </el-container>
</template>

<style lang="scss" scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: calc(100vh - 32px); // 100% - footer
  .logo {
    &-text {
      :first-child {
        font-size: 96px;
        font-weight: 900;
      }
    }
  }
  .home-button {
    width: 100%;
  }
  .el-col {
    margin-bottom: 20px;
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { decompressFromUTF16, decompressFromUint8Array } from "lz-string";
import moment from "moment";
import { IrsSerializationService } from "core";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  components: { Footer },
  name: "Home",
  emits: ["irs"],
  setup(_, { emit }) {
    const { push } = useRouter();
    const terFileInput = ref<HTMLInputElement | null>(null);
    const irsSerializationService = IrsSerializationService.get();

    const terSession = ref<string | null>(null);
    const terSessionDate = ref<string | null>(null);
    const terSessionNotification = computed(() => {
      if (terSessionDate.value) {
        return ` (${moment(terSessionDate.value).fromNow()})`;
      }
      return null;
    });

    onMounted(() => {
      terSession.value = localStorage.getItem("terSession");
      terSessionDate.value = localStorage.getItem("terSessionDate");
    });

    return {
      logoImg: require("@/assets/books.svg"),
      terFileInput,
      terSession,
      terSessionNotification,
      terSessionRestore() {
        if (!terSession.value) return;
        const json = decompressFromUTF16(terSession.value);
        if (json === null) return;
        emit("irs", irsSerializationService.parse(json));
        push("graph");
      },
      async onTerFile() {
        if (terFileInput.value?.files) {
          const file = terFileInput.value.files[0];
          const irsContent = new Uint8Array(await file.arrayBuffer());
          const irsJson = decompressFromUint8Array(irsContent) as string;
          emit("irs", irsSerializationService.parse(irsJson));
          push("graph");
        }
      }
    };
  }
});
</script>
