<template>

  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md5 lg4>
      <v-card>
        <v-toolbar dark class="primary">
          <v-toolbar-title>Anmeldung SensorHub</v-toolbar-title>
        </v-toolbar>
        <v-card-title primary-title>
          <!-- img src="../assets/sodian-group.svg" / -->
        </v-card-title>
        <v-card-text class="text-xs-right">
          <p v-if="error" class="text-xs-left">
            <v-alert error :value="error">
              {{error}}
            </v-alert>
          </p>
          <v-form v-model="valid">
            <v-text-field
              label="E-mail"
              v-model="email"
              required
              type="email"
            ></v-text-field>
            <v-text-field
              label="Kennwort"
              v-model="password"
              type="password"
              :rules="pwdRules"
              required
              v-on:keyup.13="login"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat :disabled="!email" @click="reset">Kennwort reset</v-btn>
          <v-btn flat :disabled="!valid" @click="login">Anmelden</v-btn>
        </v-card-actions>
        <v-progress-linear v-if="progress" v-bind:indeterminate="true"></v-progress-linear>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import AuthStore from '../store/user';

@Component
export default class Login extends Vue {
  public progress: boolean = false;
  public valid: boolean = false;
  public password: string = '';
  public email: string = '';
  public error: string = '';

  public data() {
    return {
      pwdRules: [
        (v: string) => !!v || 'Password is required',
        (v: string) => v.length >= 8 || 'Password must be greater or equal than 8 characters',
      ],
    };
  }

  public async login() {
    this.progress = true;
    this.error = '';

    try {
      await AuthStore.dispatchLogin({username: this.email, password: this.password});
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-email':
          this.error = 'E-Mail/Kennwort ist falsch.';
          break;

        default:
          this.error = err.message;
      }
    } finally {
      this.progress = false;
    }
  }

  public async reset() {
    this.progress = true;
    this.error = '';

    try {
      await AuthStore.dispatchResetPassword(this.email);
      this.error = 'Es wurde eine Mail mit weiteren Informationen an sie versandt.';
    } catch (err) {
      this.error = 'Kennwort rücksetzen nicht möglich.';
    } finally {
      this.progress = false;
    }
  }
}
</script>
