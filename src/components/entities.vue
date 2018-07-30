<template>
  <v-layout column>
    <v-btn
      @click.native="$refs.entityDialog.show()"
      class="red"
      dark
      fab
      fixed
      bottom
      right>
      <v-icon>add</v-icon>
    </v-btn>

    <v-toolbar class="secondary" dark flat>
      <v-toolbar-title>{{entityName}}</v-toolbar-title>
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
                  :no-data-text="isLoading ? 'Entities werden geladen...' : 'keine Entities vorhanden'"
                  :headers="headers"
                  :items="entities"
                  :pagination.sync="pagination"
                  :search="search"
                  rows-per-page-text="Entities pro Seite"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr @click="$refs.entityDialog.show(entityName, props.item)">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.description }}</td>
        </tr>
      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        von {{ pageStart }} bis {{ pageStop }}
      </template>
    </v-data-table>

    <entity-edit ref="entityDialog"></entity-edit>
  </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Watch, Provide, Component} from 'vue-property-decorator';
  import EntityEdit from './entity-edit.vue';
  import {executeFinder, getFinderMethod, getMainObjects} from '@/services/backend';
  import {mapGetters} from 'vuex';
  import {NameDescription} from '@/model/NameDescription';

  @Component({
    data() {
      return {
        entities: [],
      };
    },

    computed: {
      entityName() {
        if (this && this.$route && this.$route.params) {
          return  this.$route.params.entity;
        }
      },

      isLoading() {
        return false;
      },
    },

    components: {EntityEdit},
  })
  export default class EntityList extends Vue {
    private search = '';
    private pagination = {
      rowsPerPage: -1,
      sortBy: 'id',
      descending: false,
    };
    private headers = [
      {
        text: 'ID',
        align: 'left',
        value: 'id',
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

    @Watch('$route.params.entity')
    private onEntityChange() {
        this.initializeEntities();
    }

    private created() {
        this.initializeEntities();
    }

    private async initializeEntities() {
      const mo = getMainObjects().find((f) => f.name === this.$route.params.entity) as NameDescription;
      const finder = getFinderMethod(mo);
      this.$data.entities = await executeFinder(finder);
    }
  }

</script>
