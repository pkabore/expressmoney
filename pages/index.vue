<template>
  <div>
    <section class="section">
    <h1 class="title has-text-primary has-text-centered">
          Bienvenu(e) chez Express Money
        </h1>
        <h2 class="subtitle has-text-primary has-text-centered">
          Express Money, Express Crédit
        </h2>
        <div class="columns box">
          <div class="column is-third-desktop">
                <h2 class="title has-text-primary is-size-6-mobile is-size-5-tablet">Vous êtes:</h2>
                <ul>
                  <li key="1">
                    <font-awesome-icon
                      class="has-text-primary"
                      :icon="['fas', 'check-circle']"
                    />
                    Etudiant ?
                  </li>
                  <li key="2">
                    <font-awesome-icon
                      class="has-text-primary"
                      :icon="['fas', 'check-circle']"
                    />
                    Travailleur du secteur public ?
                  </li>
                  <li key="3">
                    <font-awesome-icon
                      class="has-text-primary"
                      :icon="['fas', 'check-circle']"
                    />
                    Travailleur du secteur privé ?
                  </li>
                </ul>
          </div>

          <div class="column is-two-thirds-desktop">
                <h2 class="title has-text-primary is-size-6-mobile is-size-5-tablet">
                  Et vous êtes dans l’une des situations suivantes:
                </h2>
                <ul class="is-size-5-mobile is-size-6-desktop">
                  <li>
                    <font-awesome-icon
                      :icon="['fas', 'circle']"
                      class="has-text-primary"
                    />
                    Vous avez du mal à finir les mois avec votre salaire ou
                    bourse
                  </li>
                  <li>
                    <font-awesome-icon
                      :icon="['fas', 'circle']"
                      class="has-text-primary"
                    />
                    Vous êtes en situation d’urgence et vous n’avez pas d’argent
                    à cet instant.
                  </li>
                  <li>
                    <font-awesome-icon
                      :icon="['fas', 'circle']"
                      class="has-text-primary"
                    />
                    Vous voulez envoyer de l’argent à une personne en urgence.
                  </li>
                  <li>
                    <font-awesome-icon
                      :icon="['fas', 'circle']"
                      class="has-text-primary"
                    />
                    Vous êtes travailleur et vous trouver gênant ou vous avez du
                    mal à obtenir de l’aide financière auprès de vos collègues
                    en cas de besoin
                  </li>
                </ul>
              </div>
            </div>
    </section>
    <section class="section has-background-light py-1">
      <div class="columns box">
        <div class="column">
            <h2 class="subtitle has-text-centered has-text-primary mt-1">
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
                Vous êtes au bon endroit.
              </h2>
              <p class="has-text-justify">
                Avec Express Money,
                <strong>emprunter la somme qui vous convient</strong> pour votre
                problème (en 5 minutes) et la rembourser à votre salaire ou
                bourse suivante.
              </p>
              <p class="has-text-centered mt-5" v-if="!this.$auth.loggedIn">
                <NuxtLink to="/register" class="button is-outlined is-block is-primary"
                  ><font-awesome-icon
                    class="is-small"
                    :icon="['fas', 'hand-point-right']"
                  />&nbsp; Créer un compte pour commencer</NuxtLink
                >
              </p>
          </div>
        </div>
    </section>
    <section class="section">
      <h2
        class="subtitle has-text-primary has-text-centered has-text-primary mb-6"
      >
        Avantages
      </h2>
      <div class="container">
        <div class="columns is-centered">
          <div class="column mt-0 pt-0 mx-0">
            <div class="card">
              <div class="card-content">
                <h1
                  class="title has-text-primary is-size-6-mobile is-size-5-tablet has-text-centered"
                >
                  <font-awesome-icon
                    class="is-small"
                    :icon="['fas', 'paper-plane']"
                  />&nbsp;Rapidité
                </h1>
                <h2 class="subtile my-2 is-size-6-mobile">
                  <strong>Rapidité d’obtention du prêt en 5min</strong>
                </h2>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Obcaecati veritatis expedita ad ipsa quia. Provident id odio,
                  error voluptatum earum quibusdam neque ipsum similique quasi?
                  Minima accusantium modi voluptatum aliquid!
                </p>
              </div>
            </div>
          </div>
          <div class="column mt-0 pt-0 mx-0">
            <div class="card">
              <div class="card-content">
                <h1
                  class="title has-text-primary is-size-6-mobile is-size-5-tablet has-text-centered"
                >
                  <font-awesome-icon
                    class="is-small"
                    :icon="['fas', 'link']"
                  />&nbsp; Disponibilité
                </h1>
                <h2 class="subtile my-2 is-size-6-mobile">
                  <strong> Disponible 7j /7 et 24h/24</strong>
                </h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Ipsum velit, asperiores mollitia tempore eveniet ipsam atque
                  culpa quidem veritatis enim! Placeat voluptatibus doloremque
                  porro consectetur impedit eum architecto mollitia! Et!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column mt-0 pt-0 mx-0">
            <div class="card">
              <div class="card-content">
                <h1
                  class="title has-text-primary is-size-6-mobile is-size-5-tablet has-text-centered"
                >
                  <font-awesome-icon
                    class="is-small"
                    :icon="['fas', 'percentage']"
                  />&nbsp; Taux
                </h1>
                <h2 class="subtile my-2 is-size-6-mobile">
                  Taux de remboursement insignifiant <br /><strong
                    >(Juste les frais de transfert)</strong
                  >
                </h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
                  consectetur tempore, quas harum a et fugit quos nemo dolores
                  magnam nisi suscipit cum aliquid, error vitae ipsa ipsum
                  blanditiis amet.
                </p>
              </div>
            </div>
          </div>
          <div class="column mt-0 pt-0 mx-0">
            <div class="card">
              <div class="card-content">
                <h1
                  class="title has-text-primary is-size-6-mobile is-size-5-tablet has-text-centered"
                >
                  <font-awesome-icon
                    class="is-small"
                    :icon="['fas', 'mouse-pointer']"
                  />&nbsp; Notre Service est en ligne
                </h1>
                <h2 class="subtile my-2 is-size-6-mobile">
                  Entièrement en ligne <br /><strong
                    >(Ne nécessite aucun déplacement)</strong
                  >
                </h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Provident, laboriosam asperiores illo dolore, quam ducimus,
                  sunt expedita temporibus atque fuga est. Quas incidunt ex
                  blanditiis non tenetur, animi consequuntur alias!
                </p>
              </div>
            </div>
          </div>
        </div>
        <p class="has-text-centered" v-if="!this.$auth.loggedIn">
          <NuxtLink to="/register" class="button is-outlined is-block is-primary"
            ><font-awesome-icon
              class="is-small"
              :icon="['fas', 'hand-point-right']"
            />&nbsp; Créer un compte pour commencer</NuxtLink
          >
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      title: "Accueil"
    };
  },
  computed: {}
};
</script>

<style lang="css" scoped></style>
