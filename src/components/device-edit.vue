<template>
  <v-dialog v-model="dialog" persistent width="640">
    <v-card>
      <v-card-title class="headline">
        Gerätedaten
      </v-card-title>
      <v-alert error :value="saveError">
        Beim Speichern der Daten trat ein Fehler auf.
      </v-alert>
      <v-card-text style="min-height:400px;">
        <v-tabs v-model="selectedTab">
          <v-tab color="primary" dark>
            <v-tabs-slider></v-tabs-slider>
            <v-tab-item href="#tab-1">Allgemein</v-tab-item>
            <v-tab-item href="#tab-2">Sicherheit</v-tab-item>
            <v-tab-item v-if="updateMode" href="#tab-3">Status</v-tab-item>
          </v-tab>
          <v-tab-items>
            <v-tabs-content id="tab-1">
              <v-container fluid grid-list-md>
                <v-layout gs-grid wrap>
                  <v-flex xs12 md6 v-if="updateMode">
                    <v-text-field label="Geräte-ID"
                                  :disabled="true"
                                  v-model="device.id"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field label="Name" v-model="device.name"
                                  required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="Beschreibung" v-model="device.description"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-switch label="Gerät blockieren" color="red" v-model="device.blocked"></v-switch>
                  </v-flex>
                </v-layout>
                <small>* Pflichtfelder</small>
              </v-container>
            </v-tabs-content>
            <v-tabs-content id="tab-2">
              <v-container fluid grid-list-md>
                <v-layout v-if="credentials" column>
                  <v-flex xs12 v-if="updateMode">
                    <v-layout>
                      <v-flex xs3 class="subheading">MQTT Client-ID</v-flex>
                      <v-flex xs8><code style="word-break: break-all">{{device.clientId}}</code></v-flex>
                      <v-flex xs1>
                        <v-tooltip top>
                          <v-btn icon slot="activator" @click.native="copyClientID"><v-icon>content_copy</v-icon></v-btn>
                          <span>in Zwischenablage kopieren</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-layout align-center>
                    <v-flex xs10 pl-2>
                      <v-select
                        v-bind:items="credentials"
                        v-model="selectedCredential"
                        label="Select"
                        single-line
                        item-text="name"
                        return-object
                      >
                      </v-select>
                    </v-flex>
                    <v-btn flat icon color="error" @click.native.stop="removeCredential">
                      <v-icon>remove</v-icon>
                    </v-btn>
                    <v-btn flat
                           icon
                           color="primary"
                           :disabled="addCertDisabled"
                           @click.native.stop="addCredential">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-layout>
                  <v-layout v-if="selectedCredential">
                    <v-flex xs12 v-if="selectedCredential.name != 'Neues Zertifikat'">
                      <v-btn v-if="selectedCredential.certificate" @click.native="downloadCertificate">Download Zertifkat</v-btn>
                      <v-btn v-else-if="selectedCredential.publicKey" @click.native="downloadPublicKey">Download Public-Key</v-btn>
                      <v-btn v-if="selectedCredential.privateKey" @click.native="downloadPrivateKey">Download Private-Key</v-btn>
                    </v-flex>
                    <v-flex v-else>
                      <v-text-field
                        v-model="selectedCredential.key"
                        label="Schlüssel/Zertifikat"
                        multi-line
                        :rows="7"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
              </v-container>
            </v-tabs-content>
            <v-tabs-content v-if="updateMode" id="tab-3">
              <v-container fluid>
                <v-layout row mb-2>
                  <h3>Letzte Aktivität<v-btn icon @click.native="reloadState"><v-icon>refresh</v-icon></v-btn></h3>
                </v-layout>
                <v-layout row mb-2>
                  <v-flex xs4>
                    <strong>Fehlerzeit</strong>
                  </v-flex>
                  <v-flex xs8>
                    {{iot.lastErrorTime | datetime}}
                  </v-flex>
                </v-layout>
                <v-layout row mb-2>
                  <v-flex xs4>
                    <strong>Fehlertext</strong>
                  </v-flex>
                  <v-flex xs8>
                    <span v-if="iot.lastErrorStatus">{{iot.lastErrorStatus.message}}</span>
                  </v-flex>
                </v-layout>
                <v-layout row mb-2>
                  <v-flex xs4>
                    <strong>Telemetrieereignis empfangen</strong>
                  </v-flex>
                  <v-flex xs8>
                    {{iot.lastEventTime | datetime}}
                  </v-flex>
                </v-layout>
                <v-layout row mb-2>
                  <v-flex xs4>
                    <strong>Herzschlag (nur MQTT)</strong>
                  </v-flex>
                  <v-flex xs8>
                    {{iot.lastHeartbeatTime | datetime}}
                  </v-flex>
                </v-layout>
                <v-layout row mb-2>
                  <v-flex xs4>
                    <strong>Konfiguration gesendet</strong>
                  </v-flex>
                  <v-flex xs8>
                    {{iot.lastConfigSendTime | datetime}}
                  </v-flex>
                </v-layout>
              </v-container>
            </v-tabs-content>
          </v-tab-items>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat v-if="updateMode" :loading="deleting" @click.stop="deleteDialog=true">Löschen</v-btn>
        <v-btn flat :loading="saving" :disabled="!device.name" @click.native="saveDevice">Speichern</v-btn>
        <v-btn flat @click.native="dialog = false">Schliessen</v-btn>

        <v-dialog v-model="deleteDialog" lazy width="50%">
          <v-card>
            <v-card-title>Wollen sie das Gerät wirklich löschen?</v-card-title>
            <v-card-actions class="pa-3">
              <v-spacer></v-spacer>
              <v-btn flat @click.native="deleteDialog = false">abbrechen</v-btn>
              <v-btn color="error" @click.native="deleteDevice">löschen</v-btn>
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
import DeviceStore from '../store/device';
import {DeviceIoTState} from '../store/device/state';
import * as moment from 'moment';
import * as download from 'downloadjs';
import * as copy from 'copy-to-clipboard';

const defaultValue = {
  id: '',
  name: '',
  description: '',
  credentials: [] as any,
  blocked: false,
};

@Component({
  data() {
    return {
      selectedCredential: {},
      iot: {},
      credentials: [],
    };
  },
})
export default class DeviceEdit extends Vue {
  public deleteDialog = false;
  public dialog = false;
  public saveError = false;
  public saving = false;
  public deleting = false;
  public selectedTab = 'tab-1';
  public iot = {};
  public selectedCredential: any;
  public credentials: any[] = [];

  public device = Object.assign({}, defaultValue);

  public async show(item = defaultValue) {
    this.dialog = true;
    this.saveError = false;
    this.selectedTab = 'tab-1';
    this.iot = {};

    Object.assign(this.device, item);
    this.reloadState();

    if (Array.isArray(item.credentials)) {
      this.credentials = item.credentials.map((c: any, idx: number) => {
        return {
          ...c,
          name: (idx + 1) + '. Zertifikat/Schlüssel',
        };
      });
      this.selectedCredential = this.credentials[0];
    } else {
      this.credentials = [];
      this.selectedCredential = {};
    }
  }

  public async reloadState() {
    if (this.device.id) {
      this.iot = await DeviceStore.dispatchGetDeviceIoTState(this.device.id);
    }
  }

  public async saveDevice() {
    const saveObj = this.device;
    let savePromise;

    if (Array.isArray(this.credentials)) {
      this.device.credentials = this.credentials.map((c) => {
        if (c.key && c.key.includes('CERTIFICATE')) {
          return {
            certificate: c.key,
          };
        } else if (c.key && c.key.includes('PUBLIC')) {
            return {
              publicKey: c.key,
            };
        } else {
          return {
            certificate: c.certificate,
            publicKey: c.publicKey,
          };
        }
      });
    }

    if (this.updateMode) {
      savePromise = DeviceStore.dispatchUpdateDevice(saveObj);
    } else {
      savePromise = DeviceStore.dispatchCreateDevice(saveObj);
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

  public removeCredential() {
    const idx = this.credentials.findIndex((c: any) => c === this.selectedCredential);
    if (idx >= 0) {
      // ensure changed data will be saved
      this.device.credentials = this.credentials;

      this.credentials.splice(idx, 1);
      this.selectedCredential = this.credentials.length > 0 ? this.credentials[0] : {};
    }
  }

  public addCredential() {
    // ensure changed data will be saved
    this.device.credentials = this.credentials;

    const cert = {
      name: 'Neues Zertifikat',
      key: '',
    };
    this.credentials.push(cert);
    this.selectedCredential = cert;
  }

  public async deleteDevice() {
    this.deleteDialog = false;
    this.saveError = false;
    this.deleting = true;

    try {
      await DeviceStore.dispatchDeleteDevice(this.device.id);
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
    return !!this.device.id;
  }

  get addCertDisabled() {
    const val = this.credentials.find((c: any) => c.name !== 'Neues Zertifikat') ||
      this.credentials.length >= 3;

    return !!val;
  }

  public downloadCertificate() {
    download((this.selectedCredential as any).certificate,
      'cert_' + this.device.id + '.pem', 'text/plain');
  }

  public downloadPrivateKey() {
    download((this.selectedCredential as any).privateKey,
      'priv_' + this.device.id + '.pem', 'text/plain');
  }

  public downloadPublicKey() {
    download((this.selectedCredential as any).publicKey,
      'pub_' + this.device.id + '.pem', 'text/plain');
  }

  public copyClientID() {
    copy((this.device as any).clientId);
  }
}
</script>
