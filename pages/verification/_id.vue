<template>
  <section class="hero is-fullheight"></section>
</template>

<script>
export default {
  auth: "guest",
  layout: "empty",
  data() {
    return {};
  },
  async mounted() {
    try {
      await this.$axios.$get(
        "/api/auth/verification/" + this.$route.path.split("/")[2]
      );
      this.$router.push("/account");
    } catch (error) {
      if (error.response.data) this.error = error.response.data.message;
      else this.error = "Erreur survenue. Veuillez reéssayer";
      this.$buefy.snackbar.open({
        type: "is-danger",
        indefinite: true,
        position: "is-top-right",
        message: error.response.data ? error.response.data.message : "Erreur",
      });
      this.$router.push("/account");
    }
  },
};
</script>