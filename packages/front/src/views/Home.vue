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
          <el-button class="home-button" @click="$router.push('graph')">
            Importuj z pliku *.ter
          </el-button>
        </el-col>
        <el-col :span="24">
          <el-button
            disabled
            class="home-button"
            @click="$router.push('graph')"
          >
            Przywróć poprzednią sesję
          </el-button>
        </el-col>
      </el-row>
    </el-main>
    <Footer />
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
/*
.header-content {
  padding: 0px;
} */
</style>

<script lang="ts">
import { defineComponent } from "vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  components: { Footer },
  name: "Home",
  setup() {
    return { logoImg: require("@/assets/books.svg") };
  }
});
</script>
