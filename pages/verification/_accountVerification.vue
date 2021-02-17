<template>
  <section class="hero is-fullheight">
    <div class="container">
      <div class="columns is-centered mt-6">
        <div class="column is-align-self-center relative mt-6">
          <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      isFullPage: true,
    };
  },
  async mounted() {
    try {
      if (this.$auth.user.confirmation === "") {
        this.$router.push("/credit");
        return;
      }
      await this.$axios.$get(
        "/api/auth/verification/" + this.$route.path.split("/")[2]
      );
      await this.$auth.fetchUser();
      this.$router.push("/credit");
    } catch (error) {
      this.isLoading = false;
      this.$buefy.toast.open({
        type: "is-danger",
        duration: 5000,
        position: "is-top-right",
        message: error.response.data ? error.response.data.message : "Erreur",
      });
      this.$router.push("/credit");
    }
  },
};
</script>

<style scoped>
.relative {
  position: relative !important;
  width: 300px;
  height: 300px;
}
</style>