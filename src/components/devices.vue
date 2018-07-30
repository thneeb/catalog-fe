<template>
  <v-layout column>
    <v-btn
      v-if="getCurrentProject"
      @click.native="$refs.deviceDialog.show()"
      class="red"
      dark
      fab
      fixed
      bottom
      right>
      <v-icon>add</v-icon>
    </v-btn>

    <v-flex xs12 v-if="!getCurrentProject">
      <v-snackbar
        :timeout="1000"
        :top="true"
        v-model="projectHint"
      >
        Bitte ein Projekt auswählen
        <v-btn flat color="primary" @click.native="snackbar = false">Schliessen</v-btn>
      </v-snackbar>
    </v-flex>
    <v-layout v-else column>
      <v-toolbar class="secondary" dark flat>
        <v-toolbar-title>Geräte</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field class="mr-2"
                      dark
                      append-icon="search"
                      label="Suche"
                      single-line
                      hide-details
                      v-model="search"
        ></v-text-field>
      </v-toolbar>
      <v-data-table color="primary"
                    :loading="isLoading"
                    :headers="headers"
                    :items="getDevices"
                    :pagination.sync="pagination"
                    :search="search"
                    :no-data-text="isLoading ? 'Geräte werden geladen...' : 'keine Geräte vorhanden'"
                    rows-per-page-text="Geräte pro Seite"
                    class="elevation-1">
        <template slot="items" slot-scope="props">
          <tr @click="$refs.deviceDialog.show(props.item)">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.description }}</td>
          </tr>
        </template>
        <template slot="pageText" slot-scope="{ pageStart, pageStop }">
          von {{ pageStart }} bis {{ pageStop }}
        </template>
      </v-data-table>
    </v-layout>

    <device-edit ref="deviceDialog"></device-edit>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import AuthStore from '../store/user';
import DeviceEdit from './device-edit.vue';
import {mapGetters} from 'vuex';

@Component({
  computed: {
    ...mapGetters('device', ['getDevices', 'isLoading']),
    ...mapGetters('project', ['getCurrentProject']),
  },
  components: {DeviceEdit},
})
export default class DeviceList extends Vue {
  public search = '';
  public projectHint = true;
  public pagination = {
    rowsPerPage: -1,
    sortBy: 'name',
    descending: false,
  };
  public headers = [
    {
      text: 'Name',
      align: 'left',
      value: 'name',
    },
    {
      text: 'ID',
      align: 'left',
      value: 'id',
    },
    {
      text: 'Beschreibung',
      align: 'left',
      value: 'description',
    },
  ];
}
</script>
