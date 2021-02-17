<template>
  <section class="section">
    <div class="columns is-centered mt-6">
      <div class="column mt-6 is-6-desktop is-6-tablet">
        <h1
          class="has-text-centered title mt-6 mb-0"
          v-if="error.statusCode === 404"
        >{{ pageNotFound }}</h1>
        <h1 class="has-text-centered title mt-6 mb-0" v-else>{{ otherError }}</h1>
        <p class="has-text-centered">
          <NuxtLink class="text-decoration-none" to="/">Page d'accueil</NuxtLink>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: "default",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 Page non trouvée",
      otherError: "Erreur survenue",
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>