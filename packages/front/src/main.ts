import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import installElementPlus from "./plugins/element";
import moment from "moment";

moment.locale("pl");
const app = createApp(App);
installElementPlus(app);

app.use(router).mount("#app");
