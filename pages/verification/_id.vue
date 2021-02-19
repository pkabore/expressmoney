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
      this.$buefy.toast.open({
        type: "is-danger",
        duration: 5000,
        position: "is-top-right",
        message: error.response.data ? error.response.data.message : "Erreur",
      });
      this.$router.push("/account");
    }
  },
};
</script>