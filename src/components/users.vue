<template>
  <v-layout column>
    <v-btn
      @click.native="$refs.userDialog.show()"
      class="red"
      dark
      fab
      fixed
      bottom
      right>
      <v-icon>add</v-icon>
    </v-btn>

    <v-toolbar class="secondary" dark flat>
      <v-toolbar-title >Benutzer</v-toolbar-title>
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
                  :no-data-text="isLoading ? 'Benutzer werden geladen...' : 'keine Benutzer vorhanden'"
                  :headers="headers"
                  :items="getUsers"
                  :pagination.sync="pagination"
                  :search="search"
                  rows-per-page-text="Benutzer pro Seite"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr @click="$refs.userDialog.show(props.item)">
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.description }}</td>
        </tr>
      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        von {{ pageStart }} bis {{ pageStop }}
      </template>
    </v-data-table>

    <user-edit ref="userDialog"></user-edit>
  </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import UserEdit from './user-edit.vue';
  import {mapGetters} from 'vuex';

  @Component({
    computed: {
      ...mapGetters('user', ['getUsers', 'isLoading']),
    },
    components: {UserEdit},
  })
  export default class ProjectList extends Vue {
    private search = '';
    private pagination = {
      rowsPerPage: -1,
      sortBy: 'email',
      descending: false,
    };
    private headers = [
      {
        text: 'E-Mail',
        align: 'left',
        value: 'email',
      },
      {
        text: 'Name',
        align: 'left',
        value: 'name',
      },
      {
        text: 'Beschreibung',
        align: 'left',
        value: 'description',
      },
    ];
  }

</script>
