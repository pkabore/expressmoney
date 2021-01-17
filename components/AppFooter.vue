<template>
  <footer class="has-background-dark pt-2 mt-2">
    <div class="content mt-1 v-centered has-text-centered has-text-white">
      <p class="is-size-5">
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
    }
  }
};
</script>
