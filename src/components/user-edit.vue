<template>
  <v-dialog v-model="dialog" persistent width="500">
    <v-card>
      <v-card-title class="headline">
        Benutzerdaten
      </v-card-title>
      <v-alert error :value="saveError">
        Beim Speichern der Daten trat ein Fehler auf.
      </v-alert>
      <v-card-text>
        <v-container fluid grid-list-md pa-0>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="E-Mail"
                            v-model="user.email"
                            required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Name" v-model="user.name"
                            required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-switch label="Benutzerkonto deaktiviert" color="red" v-model="user.disabled"></v-switch>
            </v-flex>
          </v-layout>
        </v-container>
        <small>* Pflichtfelder</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat v-if="updateMode" :loading="deleting" @click.stop="deleteDialog=true">Löschen</v-btn>
        <v-btn flat :loading="saving" :disabled="!user.name" @click.native="saveUser">Speichern</v-btn>
        <v-btn flat @click.native="dialog = false">Schliessen</v-btn>

        <v-dialog v-model="deleteDialog" lazy width="50%">
          <v-card>
            <v-card-title>Wollen sie den User wirklich löschen?</v-card-title>
            <v-card-actions class="pa-3">
              <v-spacer></v-spacer>
              <v-btn flat @click.native="deleteDialog = false">abbrechen</v-btn>
              <v-btn color="error" @click.native="deleteUser">löschen</v-btn>
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
import UserStore from '../store/user';
import {UserData} from '../store/user/state';

const defaultValue: UserData = {
  id: '',
  email: '',
  name: '',
  disabled: false,
  projectIds: [''],
};

@Component
export default class UserEdit extends Vue {
  private deleteDialog = false;
  private dialog = false;
  private saveError = false;
  private saving = false;
  private deleting = false;

  private user = Object.assign({}, defaultValue);

  public show(item = defaultValue) {
    this.dialog = true;
    this.saveError = false;

    Object.assign(this.user, item);
  }

  private async saveUser() {
    const saveObj = this.user;
    let savePromise;

    if (this.updateMode) {
      savePromise = UserStore.dispatchUpdateUser(saveObj);
    } else {
      savePromise = UserStore.dispatchCreateUser(saveObj);
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

  private async deleteUser() {
    this.deleteDialog = false;
    this.saveError = false;
    this.deleting = true;

    try {
      await UserStore.dispatchDeleteUser(this.user.id);
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
    return !!this.user.id;
  }
}
</script>
