import { createApp } from "vue";
import App from "./App.vue";
import firebase from "./firebase";
import database from "./database";

firebase.initialize();
database.initialize();

createApp(App).mount("#app");
