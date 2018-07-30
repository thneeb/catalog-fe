<template>
  <v-layout column>
    <v-btn
      @click.native="$refs.projectDialog.show()"
      class="red"
      dark
      fab
      fixed
      bottom
      right>
      <v-icon>add</v-icon>
    </v-btn>

    <v-toolbar class="secondary" dark flat>
      <v-toolbar-title >Projekte</v-toolbar-title>
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
    <v-data-table :loading="isLoading"
                  :no-data-text="isLoading ? 'Projekte werden geladen...' : 'keine Projekte vorhanden'"
                  :headers="headers"
                  :items="getProjects"
                  :pagination.sync="pagination"
                  :search="search"
                  rows-per-page-text="Projekte pro Seite"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr @click="$refs.projectDialog.show(props.item)">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.description }}</td>
        </tr>
      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        von {{ pageStart }} bis {{ pageStop }}
      </template>
    </v-data-table>

    <project-edit ref="projectDialog"></project-edit>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import AuthStore from '../store/user';
import ProjectEdit from './project-edit.vue';
import {mapGetters} from 'vuex';

@Component({
  computed: {
    ...mapGetters('project', ['getProjects', 'isLoading']),
  },
  components: {ProjectEdit},
})
export default class ProjectList extends Vue {
  public search = '';
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
