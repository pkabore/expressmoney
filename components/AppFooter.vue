<template>
  <footer class="footer my-0 py-1 has-background-grey-darker">
    <div class="columns is-centered has-text-centered">
      <div class="column">
        <h2 class="has-text-light is-uppercase">
          <b-icon icon="map-marked-alt" class="circular-sui" size="is-medium"></b-icon>&nbsp; Contacts
        </h2>
        <ul class="mt-2">
          <li class="my-1">
            <a class="has-text-light">+226 70 00 00 00</a>
          </li>
          <li class="my-1">
            <a class="has-text-light">+226 76 00 00 00</a>
          </li>
          <li class="my-1">
            <a class="has-text-light">expressmoney@mail.com</a>
          </li>
          <li class="my-1">
            <a class="has-text-light">17 Esshokour 2 Khouribga</a>
          </li>
        </ul>
      </div>
      <div class="column">
        <h2 class="has-text-light is-uppercase">
          <b-icon icon="link" class="circular-sui" size="is-medium"></b-icon>&nbsp; Liens
        </h2>
        <ul class="mt-2">
          <li class="my-1">
            <NuxtLink to="/" class="has-text-light">Accueil</NuxtLink>
          </li>
          <li class="my-1">
            <NuxtLink to="/credit" class="has-text-light">Crédit</NuxtLink>
          </li>
          <li class="my-1">
            <NuxtLink to="/login" class="has-text-light">Connection</NuxtLink>
          </li>
          <li class="my-1">
            <NuxtLink to="/register" class="has-text-light">Créer un compte</NuxtLink>
          </li>
        </ul>
      </div>
      <div class="column">
        <h2 class="has-text-light is-uppercase">
          <b-icon icon="hashtag" class="circular-sui" size="is-medium"></b-icon>&nbsp; Réseaux sociaux
        </h2>
        <ul class="mt-2">
          <li class="my-1">
            <a class="has-text-light">Instagram</a>
          </li>
          <li class="my-1">
            <a class="has-text-light">Facebook</a>
          </li>
          <li class="my-1">
            <a class="has-text-light">Telegram</a>
          </li>
          <li class="my-1">
            <a class="has-text-light">Twitter</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="has-text-centered">
      <p>
        <strong class="has-text-light is-family-secondary">
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