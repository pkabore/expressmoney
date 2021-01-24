<template>
  <div>
    <section class="section has-background-white">
      <!-- <div class="columns">
        <div class="column left-border">
          <img
            src="../static/logo.svg" height="30" weight="80" class="image"
            alt="Demander du crédit, c'est simple et rapide avec Express Money"
          >
        </div>
        <div class="column"> -->
          <h1 class="title has-text-centered has-text-primary">
            Bienvenu(e)
          </h1>
          <h2 class="subtitle mb-4 has-text-centered">
            Express Money, Express Crédit
          </h2>
        <!-- </div>
      </div> -->
    </section>
    <section class="section">
      <div class="columns">
        <div class="column is-third-desktop">
          <h2 class="subtitle">Vous êtes:</h2>
            <ul>
              <li key="1">
                <b-icon icon="checkbox-marked-circle-outline" size="is-small"></b-icon>
                  Etudiant ?
                </li>
                <li key="2">
                  <b-icon icon="checkbox-marked-circle-outline" size="is-small"></b-icon>
                  Travailleur du secteur public ?
                </li>
                <li key="3">
                  <b-icon icon="checkbox-marked-circle-outline" size="is-small"></b-icon>
                  Travailleur du secteur privé ?
                </li>
              </ul>
          </div>

          <div class="column is-two-thirds-desktop">
                <h2 class="subtitle">
                  Et vous êtes dans l’une des situations suivantes:
                </h2>
                <ul>
                  <li>
                    <b-icon icon="circle" size="is-small"></b-icon>
                    Vous avez du mal à finir les mois avec votre salaire ou
                    bourse
                  </li>
                  <li>
                    <b-icon icon="circle" size="is-small"></b-icon>
                    Vous êtes en situation d’urgence et vous n’avez pas d’argent
                    à cet instant.
                  </li>
                  <li>
                    <b-icon icon="circle" size="is-small"></b-icon>
                    Vous voulez envoyer de l’argent à une personne en urgence.
                  </li>
                  <li>
                    <b-icon icon="circle" size="is-small"></b-icon>
                    Vous êtes travailleur et vous trouver gênant ou vous avez du
                    mal à obtenir de l’aide financière auprès de vos collègues
                    en cas de besoin
                  </li>
                </ul>
              </div>
            </div>
    </section>
    <section class="section has-background-white py-3">
      <div class="columns">
        <div class="column">
            <h2 class="title has-text-centered has-text-primary mt-1">
                <b-icon icon="map" size="is-medium"></b-icon>
                Vous êtes au bon endroit.
              </h2>
              <p class="has-text-centered is-size-5-desktop">
                Avec Express Money,<br>
                <strong>emprunter la somme qui vous convient</strong> <br>pour votre
                problème (en 5 minutes) <br>et la rembourser à votre salaire ou
                bourse suivante.
              </p>
              <p class="has-text-centered mt-5" v-if="!this.$auth.loggedIn">
                <NuxtLink to="/register" class="button is-primary">
                <b-icon icon="arrow-right" size="is-small"></b-icon>&nbsp;&nbsp;
                Créer un compte pour commencer</NuxtLink>
              </p>
          </div>
        </div>
    </section>
    <section class="section">
      <h1
        class="title has-text-primary has-text-centered mb-6"
      >
        Avantages
      </h1>
      <div class="container">
        <div class="columns is-centered">
          <div class="column mt-0 pt-0 mx-0">
            <div class="box">
              <h1
                  class="subtitle has-text-success has-text-centered bold-text"
                ><b-icon icon="checkbox-marked-circle-outline" size="is-small"></b-icon>&nbsp; Rapidité
              </h1>
              <p class="has-text-centered">
                <strong>Rapidité d’obtention du prêt en 5min</strong>
              </p>
            </div>
          </div>
          <div class="column mt-0 pt-0 mx-0">
            <div class="box">
              <h1
                  class="subtitle has-text-success has-text-centered bold-text"
                ><b-icon icon="checkbox-marked-circle-outline" size="is-small"></b-icon>&nbsp; Disponibilité
              </h1>
              <p class="has-text-centered">
                <strong> Disponible 7j /7 et 24h/24</strong>
              </p>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column mt-0 pt-0 mx-0">
            <div class="box">
                <h1
                  class="subtitle has-text-success has-text-centered bold-text"
                ><b-icon icon="checkbox-marked-circle-outline" size="is-small"></b-icon>&nbsp; Taux
                </h1>
                <p class="has-text-centered">
                  Taux de remboursement insignifiant <br /><strong
                    >(Juste les frais de transfert)</strong
                  >
                </p>
              </div>
          </div>
          <div class="column mt-0 pt-0 mx-0">
            <div class="box">
                <h1
                  class="subtitle has-text-success has-text-centered bold-text"
                ><b-icon icon="checkbox-marked-circle-outline" size="is-small"></b-icon>&nbsp; Notre Service est en ligne
                </h1>
                <p class="has-text-centered">
                  Entièrement en ligne <br /><strong
                    >(Ne nécessite aucun déplacement)</strong
                  >
                </p>
              </div>
          </div>
        </div>
        <p class="has-text-centered" v-if="!this.$auth.loggedIn">
          <NuxtLink to="/register" class="button is-primary">
            <b-icon icon="arrow-right" size="is-small"></b-icon>&nbsp;&nbsp; Créer un compte pour commencer
          </NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  auth: false,
  head:{
    title : "Accueil",
    meta: [
			{ hid: 'description', name: 'description', content: "La mission d'Epress Money est de fournir du soutien aux étudiants et fonctionnaires  des crédits quand ils ont des besoins urgents." }
		]
  },
  data() {
    return {};
  },
  computed: {}
};
</script>