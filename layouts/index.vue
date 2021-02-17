<template>
  <div>
    <section class="hero is-primary is-medium">
      <div class="hero-head">
        <b-navbar class="is-primary" centered>
          <template #brand>
            <b-navbar-item tag="nuxt-link" to="/">Express Money</b-navbar-item>
          </template>

          <template #start>
            <b-navbar-item tag="nuxt-link" to="/">Accueil</b-navbar-item>
            <b-navbar-item tag="nuxt-link" to="/credit">Crédit</b-navbar-item>
            <b-navbar-item tag="nuxt-link" to="/contact">Contact</b-navbar-item>
            <b-navbar-item tag="nuxt-link" to="/about">A propos</b-navbar-item>
          </template>
          <template #end>
            <b-navbar-dropdown v-if="isAuthenticated" :label="account.name" hoverable>
              <b-navbar-item class="has-text-primary" tag="nuxt-link" to="/account">
                <b-icon icon="user"></b-icon>&nbsp; Compte
              </b-navbar-item>
              <a class="has-text-primary navbar-item" tag="nuxt-link" @click.prevent="handleLogout">
                <b-icon icon="sign-out-alt"></b-icon>&nbsp; Déconnection
              </a>
            </b-navbar-dropdown>
            <b-navbar-item v-if="!isAuthenticated" tag="nuxt-link" to="/login">
              <b-icon pack="fas" icon="sign-in-alt"></b-icon>&nbsp;
              <span>Se connecter</span>
            </b-navbar-item>
            <b-navbar-item v-if="!isAuthenticated" tag="nuxt-link" to="/register">
              <b-icon pack="fas" icon="user"></b-icon>&nbsp;
              <span>S'inscrire</span>
            </b-navbar-item>
          </template>
        </b-navbar>
      </div>

      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">Bienvenue chez Express Money</h1>
          <p class="subtitle">
            Prenez du crédit, quand vous avez une urgence.
            <br />Créer un compte pour commencer à utiliser nos services.
          </p>
          <p class="has-text-centered" v-if="!isAuthenticated">
            <NuxtLink to="/login" class="button is-primary">Se connecter</NuxtLink>
            <NuxtLink to="/register" class="button is-light is-outlined">Créer un compte</NuxtLink>
          </p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="columns">
        <div class="column">
          <div class="card is-fullheight">
            <div class="card-header is-flex is-justify-content-center is-flex-direction-column">
              <h2 class="title has-text-centered mt-2 has-text-primary">
                <b-icon icon="user" class="circular-sui" size="is-large" />
                <br />Vous êtes:
              </h2>
            </div>
            <div class="card-content is-fullheight">
              <div class="content">
                <ol>
                  <li v-for="item in customersProfessions" :key="item.profession" class="my-0">
                    <span class>{{ item.profession }}</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="card is-fullheight">
            <div class="card-header is-flex is-justify-content-center is-flex-direction-column">
              <h2 class="title has-text-centered mt-2 has-text-primary">
                <b-icon icon="layer-group" class="circular-sui" size="is-large" />
                <br />Et:
              </h2>
            </div>
            <div class="card-content is-fullheight">
              <div class="content">
                <ol>
                  <li v-for="item in difficulties" :key="item.title" class="my-0">
                    <span class>{{ item.title }}</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="card is-fullheight">
            <div class="card-header is-flex is-justify-content-center is-flex-direction-column">
              <h2 class="title has-text-centered mt-2 has-text-primary">
                <b-icon class="circular-sui" size="is-large" icon="map-marked-alt"></b-icon>
                <br />Vous êtes au bon endroit.
              </h2>
            </div>
            <div class="card-content is-fullheight">
              <div class="content">
                <p class="has-text-centered">
                  Avec Express Money,
                  <br />
                  <strong>emprunter la somme qui vous convient</strong>
                  <br />pour votre
                  problème (en 5 minutes)
                  <br />et la rembourser à votre salaire ou
                  bourse suivante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="h2 title has-text-centered has-text-primary">Avantages</div>
      <div class="columns">
        <div class="column" v-for="item in items" :key="item.title">
          <div class="card is-fullheight">
            <div class="card-header is-flex is-justify-content-center is-flex-direction-column">
              <h2 class="title has-text-centered mt-2 has-text-primary">
                <b-icon icon="check" class="circular-sui" size="is-large" />
                <br />
                {{item.title}}
              </h2>
            </div>
            <div class="card-content is-fullheight">
              <div class="content">
                <p class="has-text-centered">{{item.description}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="has-text-centered" v-if="!isAuthenticated">
        <NuxtLink
          to="/register"
          class="button is-outlined is-primary"
        >Créer un compte pour commencer</NuxtLink>
      </p>
    </section>
    <AppFooter />
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: "Rapidité",
          description: "Rapidité d’obtention du prêt en 5min",
          icon: "mdi-flash",
        },
        {
          title: "Disponibilité",
          description: "Disponible 7j /7 et 24h/24",
          icon: "mdi-check-bold",
        },
        {
          title: "Taux",
          description: "Frais d'envoi à 5% du montant",
          icon: "mdi-percent",
        },
        {
          title: "En ligne",
          description: "Ne nécessite aucun déplacement",
          icon: "mdi-lan-connect",
        },
      ],
      difficulties: [
        {
          title:
            "Vous avez du mal à finir les mois avec votre salaire ou bourse",
          icon: "mdi-circle",
        },
        {
          title:
            "Vous êtes en situation d’urgence et vous n’avez pas d’argent à cet instant.",
          icon: "mdi-circle",
        },
        {
          title: "Vous voulez envoyer de l’argent à une personne en urgence.",
          icon: "mdi-circle",
        },
        {
          title:
            "Vous êtes travailleur et vous trouver gênant de demander du soutien à vos collègues",
          icon: "mdi-circle",
        },
        {
          title:
            "Vous avez du mal à obtenir de l’aide financière auprès de vos collègues en cas de besoin",
          icon: "mdi-circle",
        },
      ],
      customersProfessions: [
        { profession: "Étudiant", icon: "mdi-check-circle" },
        { profession: "Travailleur du secteur public", icon: "mdi-suitcase" },
        { profession: "Travailleur du secteur privé", icon: "mdi-suitcase" },
      ],
    };
  },
  computed: {
    isAuthenticated() {
      return this.$auth.loggedIn;
    },
    account() {
      return this.$auth.user;
    },
    currentDate() {
      return new Date().getFullYear();
    },
  },
  methods: {
    async handleLogout() {
      this.modal = false;
      const csrf = await this.$axios.$get("/api/auth/csrf");
      this.$axios.setHeader("XSRF-TOKEN", csrf.token);
      await this.$auth.logout("cookie");
    },
  },
};
</script>

<style scoped>
</style>