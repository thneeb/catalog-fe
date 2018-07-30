<template>
  <v-dialog v-model="dialog" persistent width="500">
    <v-card>
      <v-card-title class="headline">
        Projektdaten
      </v-card-title>
      <v-alert error :value="saveError">
        Beim Speichern der Daten trat ein Fehler auf.
      </v-alert>
      <v-card-text style="min-height:400px;">
        <v-tabs v-model="selectedTab">
          <v-tab color="primary" dark>
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#tab-1">Allgemein</v-tab>
            <v-tab href="#tab-2">Sicherheit</v-tab>
          </v-tab>
          <v-tab-item id="tab-1">
            <v-container fluid grid-list-md>
              <v-layout gs-grid wrap>
                <v-flex xs12 md6 v-if="updateMode">
                  <v-text-field label="Projekt-ID"
                                :disabled="true"
                                v-model="project.id"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field label="Name" v-model="project.name"
                                required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Beschreibung" v-model="project.description"></v-text-field>
                </v-flex>
              </v-layout>
              <small>* Pflichtfelder</small>
            </v-container>
          </v-tab-item>
          <v-tab-item id="tab-2">
            <v-container fluid grid-list-md>
              <v-layout gs-grid wrap>
                <v-flex xs12>
                  <v-checkbox label="Geräte Zertifikate austellen" color="green" v-model="project.caEnabled"></v-checkbox>
                </v-flex>
                <v-flex xs12 v-if="project.credentials && project.credentials.length > 0">
                  <v-btn @click.native="downloadCertificate">Download CA-Zertifkat</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat v-if="updateMode" :loading="deleting" @click.stop="deleteDialog=true">Löschen</v-btn>
        <v-btn flat :loading="saving" :disabled="!project.name" @click.native="saveProject">Speichern</v-btn>
        <v-btn flat @click.native="dialog = false">Schliessen</v-btn>

        <v-dialog v-model="deleteDialog" lazy width="50%">
          <v-card>
            <v-card-title>Wollen sie das Projekt wirklich löschen?</v-card-title>
            <v-card-actions class="pa-3">
              <v-spacer></v-spacer>
              <v-btn flat @click.native="deleteDialog = false">abbrechen</v-btn>
              <v-btn color="error" @click.native="deleteProject">löschen</v-btn>
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
import ProjectStore from '../store/project';
import * as download from 'downloadjs';

const defaultValue = {
  id: '',
  name: '',
  description: '',
  caEnabled: false,
};

@Component({
  data() {
    return {
      selectedTab: 'tab-1',
    };
  },
})
export default class ProjectEdit extends Vue {
  public deleteDialog = false;
  public dialog = false;
  public saveError = false;
  public saving = false;
  public deleting = false;

  public project = Object.assign({}, defaultValue);

  public show(item = defaultValue) {
    this.dialog = true;
    this.saveError = false;

    Object.assign(this.project, item);
  }

  public async saveProject() {
    const saveObj = this.project;
    let savePromise;

    if (this.updateMode) {
      savePromise = ProjectStore.dispatchUpdateProject(saveObj);
    } else {
      savePromise = ProjectStore.dispatchCreateProject(saveObj);
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

  public async deleteProject() {
    this.deleteDialog = false;
    this.saveError = false;
    this.deleting = true;

    try {
      await ProjectStore.dispatchDeleteProject(this.project.id);
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
    return !!this.project.id;
  }

  public downloadCertificate() {
    download((this.project as any).credentials[0].certificate,
      'ca_' + this.project.id + '.pem', 'text/plain');
  }
}
</script>
