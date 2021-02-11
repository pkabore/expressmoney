<template>
  <div>
    <AppBar />
    <main>
      <Nuxt />
    </main>
    <AppFooter />
  </div>
</template>

<script>
export default {
  mounted() {},
};
</script>

<style scoped>
main {
  min-height: 100vh;
}
</style>