<template>
  <el-container>
    <el-header class="header-content"> </el-header>
    <el-main>
      <div class="home">
        <img src="@/assets/trans_logo.png" />
        <div>
          Analyse the shit out of your books
          <div>
            <router-link to="Import">
              <el-button class="home-button">
                Importuj plik tekstowy
              </el-button>
            </router-link>
            <router-link to="Import">
              <el-button class="home-button">
                Importuj z pliku *.ter
              </el-button>
            </router-link>
          </div>
          <router-link to="/Graph">
            <el-button disabled class="home-button">
              Przywróć poprzednią wersję
            </el-button>
          </router-link>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.home-button {
  margin: 5px 5px 5px 5px;
}
.header-content {
  padding: 0px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home"
});
</script>
