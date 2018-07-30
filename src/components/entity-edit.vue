<template>
  <v-dialog v-model="dialog" persistent width="500">
    <v-card>
      <v-card-title class="headline">
        {{entityName}}
      </v-card-title>
      <v-alert error :value="saveError">
        Beim Speichern der Daten trat ein Fehler auf.
      </v-alert>
      <v-card-text>
        <entity-object :entityName="entityName" :entity="entity"/>
        <small>* Pflichtfelder</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat v-if="updateMode" :loading="deleting" @click.stop="deleteDialog=true">Löschen</v-btn>
        <v-btn flat :loading="saving" :disabled="!entity.name" @click.native="saveEntity">Speichern</v-btn>
        <v-btn flat @click.native="dialog = false">Schliessen</v-btn>

        <v-dialog v-model="deleteDialog" lazy width="50%">
          <v-card>
            <v-card-title>Wollen sie die Entität wirklich löschen?</v-card-title>
            <v-card-actions class="pa-3">
              <v-spacer></v-spacer>
              <v-btn flat @click.native="deleteDialog = false">abbrechen</v-btn>
              <v-btn color="error" @click.native="deleteEntity">löschen</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import EntityStore from '../store/entity';
import {Entity} from '@/model/Entity';
import {Property} from '@/model/Property';

const defaultValue: Entity = {
  id: '',
  href: '',
  name: '',
  description: '',
};

@Component({
    name: 'entity-edit',
})
export default class EntityEdit extends Vue {
  private deleteDialog = false;
  private dialog = false;
  private saveError = false;
  private saving = false;
  private deleting = false;

  private entity = Object.assign({}, defaultValue);
  private entityName: string = '';

  public show(entityName: string, item: Entity = defaultValue) {
    this.dialog = true;
    this.saveError = false;
    this.entityName = entityName;
    Object.assign(this.entity, item);
  }

  private async saveEntity() {
    const saveObj = this.entity;
    let savePromise;

    console.log(saveObj);

    if (this.updateMode) {
      savePromise = EntityStore.dispatchUpdateEntity(saveObj);
    } else {
      savePromise = EntityStore.dispatchCreateEntity(saveObj);
    }

    this.saveError = false;
    this.saving = true;

    try {
      await savePromise;
      this.dialog = false;
    } catch (err) {
      console.error('save error', saveObj, err);
      this.saveError = true;
    } finally {
      this.saving = false;
    }
  }

  private async deleteEntity() {
    this.deleteDialog = false;
    this.saveError = false;
    this.deleting = true;

    try {
      await EntityStore.dispatchDeleteEntity(this.entity.id);
      this.dialog = false;
    } catch (err) {
      console.error('save error', err);
      this.saveError = true;
      this.deleting = false;
    } finally {
      this.deleting = false;
    }
  }

  get updateMode() {
    return !!this.entity.id;
  }
}
</script>
