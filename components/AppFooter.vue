<template>
  <footer class="footer m-0 has-background-grey-darker">
    <div class="columns is-centered has-text-centered">
      <div class="column">
        <h2 class="has-text-light is-uppercase">Contacts</h2>
        <ul>
          <li>
            <a class="has-text-light">
              <b-icon class="has-text-light" icon="map-marker-alt"></b-icon>17 Esshokour 2 Khouribga
            </a>
          </li>
          <li>
            <a class="has-text-light">
              <b-icon class="has-text-light" icon="phone-alt"></b-icon>+226 70 00 00 00
            </a>
          </li>
          <li>
            <a class="has-text-light">
              <b-icon class="has-text-light" icon="envelope"></b-icon>expressmoney@mail.com
            </a>
          </li>
        </ul>
      </div>
      <div class="column">
        <h2 class="has-text-light is-uppercase">Liens</h2>
        <ul>
          <li>
            <NuxtLink to="/credit" class="has-text-light">Crédit</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/login" class="has-text-light">Connection</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/register" class="has-text-light">Créer un compte</NuxtLink>
          </li>
        </ul>
      </div>
      <div class="column">
        <h2 class="has-text-light is-uppercase">Réseaux sociaux</h2>
        <ul>
          <li class>
            <a class="has-text-light">Twitter</a>
          </li>
          <li class>
            <a class="has-text-light">Facebook</a>
          </li>
          <li class>
            <a class="has-text-light">Instagram</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="has-text-centered has-background-grey-dark py-2">
      <p>
        <strong class="has-text-light">
          Copyright &copy;
          {{ currentDate === 2021 ? "2021" : "2021 - " + currentDate }} Express
          Money
        </strong>
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