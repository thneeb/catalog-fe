<template>

  <div v-if="!isInitializing">
    <v-app v-if="isLoggedIn">
      <v-navigation-drawer
        fixed
        app
        enable-resize-watcher
        v-model="drawer">

        <v-list dense>
          <v-list-tile to="/">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider/>
          <v-list-tile v-for="item in menu" :key="item.label" :to="item.link">
            <v-list-tile-action>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{item.label}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider/>

          <v-list-tile @click="signOut">
            <v-list-tile-action>
              <v-icon>lock</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Abmelden</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar class="primary" light fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer" class="white--text"></v-toolbar-side-icon>
        <v-toolbar-title class="white--text">SensorHub</v-toolbar-title>
        <v-flex xs6 md4 ml-4>
          <v-select color="primary"
                    v-bind:items="projects"
                    v-model="selectedProject"
                    :loading="isLoading"
                    label="Objekttyp auswählen"
                    single-line
                    item-text="name"
                    item-value="name"
                    return-object
                    light
                    solo></v-select>
        </v-flex>
      </v-toolbar>

      <v-content>
        <v-container fluid fill-height>
          <router-view></router-view>
        </v-container>
      </v-content>

      <v-footer color="primary" app>
        <span class="white--text">© Flohr-IT 2018</span>
      </v-footer>
    </v-app>
    <v-app v-else footer>
      <v-content>
        <v-container fluid fill-height>
          <router-view></router-view>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Watch, Provide, Component} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import AuthStore from './store/user';
import ProjectStore from './store/project';
import DeviceStore from './store/device';
import {firestore} from './services/firebase';
import {getMainObjects, getObjectProperties, getFinderMethod, executeFinder} from './services/backend';
import {Entity} from './model/Entity';
import {retrieveSwaggerFile} from './services/backend';
import {Project} from './store/project/state';
import router from './router';

@Component({
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'isInitializing']),
    ...mapGetters('project', ['getProjects', 'isLoading']),
  },
  data() {
    return {
      selectedProject: null,
    };
  },
})
export default class App extends Vue {
  public drawer: boolean = true;
  public getProjects: Project[] = [];

  public menu = [
    {
      label: 'Projekte',
      icon: 'work',
      link: '/projects',
    },
    {
      label: 'Benutzer',
      icon: 'account_box',
      link: '/users',
    },
    {
      label: 'Geräte',
      icon: 'devices_other',
      link: '/devices',
    },
    {
      label: 'Einstellungen',
      icon: 'settings',
      link: '/settings',
    },
  ];

  public signOut() {
    AuthStore.dispatchLogout();
  }

  get projects() {
    const mainObjects = getMainObjects();
    for (const o of mainObjects) {
      console.log(getObjectProperties(o.name));
    }
    for (const o of mainObjects) {
      console.log(getFinderMethod(o));
    }
    for (const o of mainObjects) {
      executeFinder(getFinderMethod(o)).then((response) => {
        console.log(response);
      });
    }
    return mainObjects.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  }

  @Watch('selectedProject')
  public onProjectChange(val: Entity) {
    router.push({name: 'entities', params: {entity: val.name}});
    console.log(val);
  }
}
</script>

<style>
  @import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
</style>

<style lang="stylus">
  @require 'styles/main'
</style>
// adb shell am startservice -a com.example.androidthings.sensorhub.mqtt.CONFIGURE -e project_id sensorhub-190611 -e cloud_region europe-west1 -e registry_id BY4o5vqqh61lWa4RTVQq -e device_id dFl3gBfgT3syV48mKJ1X com.example.androidthings.sensorhub/.cloud.CloudPublisherService
