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
            Przywróć poprzednią sesję
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
import { defineComponent, ref, onMounted } from "vue";
import Footer from "@/components/Footer.vue";
import { IrsSerializationService } from "core";
import { useRouter } from "vue-router";

export default defineComponent({
  components: { Footer },
  name: "Home",
  emits: ["irs"],
  setup(_, { emit }) {
    const { push } = useRouter();
    const terFileInput = ref<HTMLInputElement | null>(null);
    const irsSerializationService = IrsSerializationService.get();
    const terSession = ref<string | null>(null);
    onMounted(() => {
      terSession.value = localStorage.getItem("terSession");
    });

    return {
      logoImg: require("@/assets/books.svg"),
      terFileInput,
      terSession,
      terSessionRestore() {
        if (terSession.value) {
          emit("irs", irsSerializationService.parse(terSession.value));
          push("graph");
        }
      },
      async onTerFile() {
        if (terFileInput.value?.files) {
          const file = terFileInput.value.files[0];
          const irsJson = await file.text();
          emit("irs", irsSerializationService.parse(irsJson));
          push("graph");
        }
      }
    };
  }
});
</script>
