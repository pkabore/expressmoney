<template>
  <div>
    <section class="section">
    <div class="columns is-centered">
      <div class="column is-four-fiths-desktop is-four-fiths-tablet">
        <div class="columns mt-4">
          <div class="column">
            <section class="section card">
              <h2 class="title has-text-centered">
                <font-awesome-icon :icon="['fas', 'question-circle']" />
                À propos de nous
              </h2>
              <p>
                Express Money est une innovation de jeunes socio-entrepreneurs
                dynamiques qui vient soutenir les travailleurs et ou les
                étudiants Boursiers qui, malgré leur salaire ou Bourse ont pour
                la plupart du temps du mal couvrir tous leurs besoins et se
                retrouvent très souvent dans <em>des situations d’urgence.</em>
              </p>
            </section>
          </div>
          <div class="column">
            <section class="section card">
              <h2 class="title has-text-centered">
                <font-awesome-icon :icon="['fas', 'briefcase']" />
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
            </section>
          </div>
        </div>
      </div>
    </div>
    <p class="has-text-centered mb-3">
      <NuxtLink to="/register" v-if="!this.$auth.loggedIn" class="button is-block is-primary">
        <font-awesome-icon :icon="['fas', 'hand-point-right']" />&nbsp; Créer un compte Express Money pour commencer
      </NuxtLink>
    </p>
    </section>
  </div>
</template>

<script>
export default {
  auth: false
};
</script>
