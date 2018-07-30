<template>

  <v-layout>
    <router-view></router-view>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Dashboard extends Vue {

  public login() {
    /*
    this.$store.dispatch('login', {
      email: this.email,
      password: this.password})
      .then(() => {
        this.progress=false;
      })
      .catch((err) => {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-email':
            this.error = 'E-Mail/Kennwort ist falsch.';
            break;

          default:
            this.error = err.message;
        }
        this.progress=false;
      });
      */
  }
}
</script>
