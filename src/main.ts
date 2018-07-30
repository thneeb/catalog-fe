import Vue from 'vue';
import './plugins/vuetify';
import '@/services/firebase';
import App from './app.vue';
import router from '@/router';
import { buildStore } from '@/store';
import '@/filter';
import EntityObject from '@/components/entity-object.vue';

Vue.config.productionTip = false;

Vue.component('entity-object', EntityObject);

// tslint:disable-next-line
new Vue({
  el: '#app',
  router,
  store: buildStore(),
  render: (h) => h(App),
});
