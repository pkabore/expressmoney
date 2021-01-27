<template>
  <section class="section">
    <div class="columns is-centered py-1">
      <div class="column my-0 py-0 is-two-thirds-tablet is-four-fiths-desktop">
        <h1 class="title has-text-centered mt-1"> Mes Informations Personnelles</h1>
          <ul class="is-hoverable">
            <li class="columns m-0 p-0 is-mobile list-item">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Nom:</div>
              <div class="column m-0 p-0 is-6">{{ account.name }}</div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Tel:</div>
              <div class="column m-0 p-0 is-6">{{ account.tel }}</div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">E-mail:</div>
              <div class="column m-0 p-0 is-6">{{ account.email }}</div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Ville:</div>
              <div class="column m-0 p-0 is-6">{{ account.city || "-"}}</div>
            </li>
            <li class="columns m-0 p-0 is-mobile mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Status:</div>
              <div class="column m-0 p-0 is-6">
                <b-tag v-if="account.isAccountValidated === 'Validé'" type="is-success">
                  {{ account.isAccountValidated }}
                </b-tag>
                <b-tag v-if="account.isAccountValidated === 'En Attente'" type="is-primary">
                  {{ account.isAccountValidated }}
                </b-tag>
                <b-tag v-if="account.isAccountValidated === 'Décliné'" type="is-danger">
                  {{ account.isAccountValidated }}
                </b-tag>
                <b-tag v-if="account.isAccountValidated === ''" type="is-info">
                  Visiteur
                </b-tag>
              </div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-4">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Copie de CNIB/Passeport:</div>
              <div class="column m-0 p-0 is-6">
                <a :target="target" :href="idUri">
                  <b-icon icon="link-variant"/> Visualiser
                </a>
              </div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Carte de travailleur:</div>
              <div class="column m-0 p-0 is-6">
                <a :target="target" :href="wcardUri">
                  <b-icon icon="link-variant"/> Visualiser
                </a>
              </div>
            </li>
            <li class="columns m-0 p-0 is-mobile mt-1">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Attestation de prise de service:</div>
              <div class="column m-0 p-0 is-6">
                <a :target="target" :href="codcUri">
                  <b-icon icon="link-variant"/> Visualiser
                </a>
              </div>
            </li>
            <li class="columns m-0 p-0 is-mobile list-item mt-4">
              <div class="column m-0 py-0 px-2 has-text-weight-bold">Date de création:</div>
              <div class="column m-0 p-0 is-6">{{ new Date(account.createdAt).toLocaleString('fr-FR') }}</div>
            </li>
            <li class="columns m-0 p-0 is-mobile mt-1">
              <div class="column m-t py-0 px-2 has-text-weight-bold">Dernière mise à Jour:</div>
              <div class="column m-0 p-0 is-6">{{ new Date(account.updatedAt).toLocaleString('fr-FR') }}</div>
            </li>
          </ul>
          <b-message v-if="account.isAccountValidated !== 'Validé'" type="is-warning"><NuxtLink to="/complete">Pendant que votre compte n'est pas encore approuvé vous pouvez mettre à jour votre dossier si nécessaire.</NuxtLink></b-message>
          <hr class="divider">
          <button class="mt-4 button is-fullwidth is-danger">
            <b-icon icon="delete" class="icon is-small" size="is-small" ></b-icon>&nbsp;&nbsp;
            Supprimer mon compte</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  head:{
    title : "Infos",
    meta: [
      { hid: 'description', name: 'description', content: "Express Money - Consultez vos informations personnelles." }
    ]
  },
  async fetch(){

  },
  computed: {
    isAuthenticated() {
        return this.$auth.loggedIn;
    },
    account() {
        return this.$auth.user;
    },
    idUri() {
      return (this.$auth.user.idUri ? '/dossiers/' + this.$auth.user.idUri : "#");
    },
    wcardUri() {
      return (this.$auth.user.wcardUri ? '/dossiers/' + this.$auth.user.wcardUri : "#");
    },
    codcUri() {
      return (this.$auth.user.codcUri ? '/dossiers/' + this.$auth.user.codcUri : "#");
    },
    target() {
      return (this.$auth.user.idUri ? '_blank' : "_self");
    }
  }
}
</script>