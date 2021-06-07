<template>
  <el-container direction="vertical">
    <el-main class="home">
      <div style="max-width:500px">
        <el-row :gutter="24" align="middle" class="logo">
          <el-col :span="8">
            <el-image :src="logoImg" />
          </el-col>
          <el-col :span="16" class="logo-text">
            <div>TER</div>
            <div>Może nie najlepiej, ale jako tako.</div>
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
          <el-col>
            <el-divider style="margin-bottom:0px;" />
          </el-col>
          <el-col :span="24">
            <el-row style="text-align:center">
              <el-col :span="24" style="margin-bottom:8px;">
                <el-image :src="logoClarin" />
              </el-col>
              <el-col :span="24" style="margin-bottom:4px;">
                Dzięki ciężkiej pracy w pocie czoła
              </el-col>
              <el-col :span="24" style="margin-bottom:4px;">
                <span>
                  <a
                    href="http://github.com/leszekblazewski"
                    target="_blank"
                    class="author"
                  >
                    @leszekblazewski
                  </a>
                  <el-divider direction="vertical" />
                  <a
                    href="http://github.com/damiankoper"
                    target="_blank"
                    class="author"
                  >
                    @damiankoper
                  </a>
                  <el-divider direction="vertical" />
                  <a
                    href="http://github.com/dex1g"
                    target="_blank"
                    class="author"
                  >
                    @dex1g
                  </a>
                </span>
              </el-col>
              <el-col :span="24" style="margin-bottom:4px;">
                <a
                  href="http://github.com/xxzxcuzx-me"
                  target="_blank"
                  class="author"
                >
                  @xxzxcuzx-me
                </a>
                <el-divider direction="vertical" />
                <a
                  href="http://github.com/Bigoz005"
                  target="_blank"
                  class="author"
                >
                  @Bigoz005
                </a>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
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
      display: flex;
      flex-direction: column;
      justify-content: center;
      :first-child {
        font-size: 96px;
        font-weight: 900;
        line-height: 0.9em;
      }
    }
    :deep(.el-image) img {
      aspect-ratio: 1;
      min-width: 140px;
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
      logoClarin: require("@/assets/logo-small.png"),
      terFileInput,
      terSession,
      terSessionNotification,
      terSessionRestore() {
        if (!terSession.value) return;
        if (terSession.value === null) return;
        emit("irs", irsSerializationService.parse(terSession.value));
        push("graph");
      },
      async onTerFile() {
        if (terFileInput.value?.files) {
          const file = terFileInput.value.files[0];
          const irsText = await file.text();
          emit("irs", irsSerializationService.parse(irsText));
          push("graph");
        }
      }
    };
  }
});
</script>
