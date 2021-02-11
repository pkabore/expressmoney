<template>
  <footer class="has-background-dark">
    <div class="content v-centered has-text-centered has-background-dark has-text-white py-2">
      <p>
        Copyright &copy;
        {{ currentDate === 2021 ? "2021" : "2021 - " + currentDate }} Express
        Money
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    currentDate() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .footer-col {
    display: block !important;
    width: 70%;
    margin: 0 auto !important;
    text-align: center !important;
  }
}
</style>