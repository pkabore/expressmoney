<template>
  <div>
    <section class="section">
    <div class="columns is-centered">
      <div class="column is-four-fiths-desktop is-four-fiths-tablet">
        <div class="columns mt-4">
          <div class="column">
              <h2 class="title has-text-info has-text-centered">
                <b-icon icon="help-circle" size="is-medium"/>
                A propos de nous
              </h2>
              <p>
                Express Money est une innovation de jeunes socio-entrepreneurs
                dynamiques qui vient soutenir les travailleurs et ou les
                étudiants Boursiers qui, malgré leur salaire ou Bourse ont pour
                la plupart du temps du mal couvrir tous leurs besoins et se
                retrouvent très souvent dans <em>des situations d’urgence.</em>
              </p>
          </div>
          <div class="column">
              <h2 class="title has-text-info has-text-centered">
                <b-icon icon="briefcase" size="is-medium"/>
                Notre mission
              </h2>
              <p>
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
    </div>
    <p class="has-text-centered mb-3">
      <NuxtLink to="/register" v-if="!this.$auth.loggedIn" class="button is-primary">
        <b-icon icon="arrow-right" size="is-small"></b-icon>&nbsp;&nbsp; Créer un compte Express Money pour commencer
      </NuxtLink>
    </p>
    </section>
  </div>
</template>

<script>
export default {
  auth: false,
  head:{
    title : "A propos",
    meta: [
			{ hid: 'description', name: 'description', content: "La mission d'Epress Money est de fournir du soutien aux étudiants et fonctionnaires  des crédits quand ils ont des besoins urgents." }
		]
  }
};
</script>
