<template>
  <div class="is-flex is-flex-direction-column has-background-light">
    <AppBar />
    <main>
      <Nuxt />
    </main>
    <AppFooter class="is-self-align-flex-end" />
  </div>
</template>

<script>
export default {
  mounted() {},
};
</script>

<style scoped>
main {
  min-height: 80vh;
}
</style>