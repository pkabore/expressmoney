<template>
  <b-loading :is-full-page="isFullPage" v-model="isLoading" :can-cancel="false"></b-loading>
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
    if (this.$auth.user.confirmation === "") {
      this.$router.push("/operations");
      return;
    }
    await this.$axios.$post(
      "/api/auth/verification" + this.$route.path.split("/")[2]
    );
  },
};
</script>