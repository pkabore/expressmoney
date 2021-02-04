<template>
  <div>
    <section class="section">
      <div class="columns is-centered">
        <div class="column is-6-desktop is-three-fiths-tablet">
          <div class="block">
            <h2 class="title has-text-primary has-text-centered">A propos de nous</h2>
            <p class="has-text-centered">
              Express Money est une innovation de jeunes socio-entrepreneurs
              dynamiques qui vient soutenir les travailleurs et ou les
              étudiants Boursiers qui, malgré leur salaire ou Bourse ont pour
              la plupart du temps du mal couvrir tous leurs besoins et se
              retrouvent très souvent dans
              <em>des situations d’urgence.</em>
            </p>
          </div>
          <div class="block">
            <h2 class="title has-text-primary has-text-centered">Notre mission</h2>
            <p class="has-text-centered">
              Le start up se veut pour ambition, de faciliter l’accès au fonds
              pour ses personnes concernées sous forme d’un
              <strong>EMPRUNT</strong> qu’ils se verront de rembourser une
              fois leur problème résolu selon les politiques de
              confidentialités ou de confiance qui leur seront envoyer lors de
              la validation de leurs comptes par sms ou mail.
            </p>
          </div>
        </div>
      </div>
      <p class="has-text-centered mb-3">
        <NuxtLink
          to="/register"
          v-if="!this.$auth.loggedIn"
          class="button is-primary is-radiusless"
        >
          <b-icon icon="chevron-triple-right" size="is-small"></b-icon>&nbsp;&nbsp; Créer un compte Express Money pour commencer
        </NuxtLink>
      </p>
    </section>
  </div>
</template>

<script>
export default {
  auth: false,
  head: {
    title: "A propos",
    meta: [
      {
        hid: "description",
        name: "description",
        content:
          "La mission d'Epress Money est de fournir du soutien aux étudiants et fonctionnaires  des crédits quand ils ont des besoins urgents.",
      },
    ],
  },
};
</script>
