<template>
  <section class="section hero is-dddark">
    <div class="columns is-centered">
      <div class="column is-6-desktop is-8-tablet pt-6">
        <div class="content">
          <h2 class="title has-text-weight-normal is-family-secondary has-text-centered">
            Salut
            <span>{{this.$auth.user.name}}!</span>
          </h2>
          <p class="has-text-centered subtitle">
            Statut de votre compte:
            <b-tag
              v-if="account.isAccountValidated === 'Validé'"
              type="is-light is-success"
            >{{ account.isAccountValidated }}</b-tag>
            <b-tag
              v-else-if="account.isAccountValidated === 'En attente'"
              type="is-light is-info"
            >{{ account.isAccountValidated }}</b-tag>
            <b-tag
              v-else-if="account.isAccountValidated === 'Décliné' || account.isAccountValidated === 'Suppression'"
              type="is-light is-danger"
            >{{ account.isAccountValidated }}</b-tag>
            <b-tag v-else>{{ 'Visiteur' }}</b-tag>
          </p>
        </div>
        <hr />
        <b-message
          v-if="account.isAccountValidated !== 'Validé' && account.isAccountValidated !== 'Suppression'"
          type="is-light is-link"
          class="has-text-centered"
        >
          <h2 class="has-text-centered title has-text-dark-light">
            <b-icon icon="info-circle"></b-icon>&nbsp;&nbsp;Informations professionnelles.
          </h2>
          <p class="has-text-centered">
            Nous avons besoins de vos informations professionnelles pour une demande de crédit. Veuillez cliquez sur le deuxième bouton
            <b-tag>Modifier</b-tag>, puis charger les fichiers nécessaires, sélectionner votre ville, cliquez sur
            <b-tag>Enregistrer les modifications</b-tag>afin de continuer.
          </p>
        </b-message>
        <hr />
        <Profile />
        <hr />
        <Complete />
        <hr />
        <Security />
      </div>
    </div>
  </section>
</template>

<script>
import "vue-tel-input/dist/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";

export default {
  components: {
    VueTelInput,
  },
  head: {
    title: "Profil",
    meta: [
      {
        hid: "description",
        name: "description",
        content: "Express Money - Consultez vos informations personnelles.",
      },
    ],
  },
  computed: {
    account() {
      return this.$auth ? this.$auth.user : {};
    },
    isLoggedIn() {
      return this.$auth ? this.$auth.loggedIn : false;
    },
    idUri() {
      return this.$auth.user.idUri ? "/dossiers/" + this.$auth.user.idUri : "#";
    },
    wcardUri() {
      return this.$auth.user.wcardUri
        ? "/dossiers/" + this.$auth.user.wcardUri
        : "#";
    },
    codcUri() {
      return this.$auth.user.codcUri
        ? "/dossiers/" + this.$auth.user.codcUri
        : "#";
    },
    target() {
      return this.$auth.user.idUri ? "_blank" : "_self";
    },
  },
};
</script>