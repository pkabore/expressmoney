<template>
  <footer class="has-background-light mt-5 pt-6">
    <div class="container">
      <div class="columns is-centered">
        <div class="column footer-col mx-3">
          <h2 class="my-0">
            <strong class>
              <b-icon icon="address-card" />&nbsp;&nbsp;
              Contact
            </strong>
          </h2>
          <ul>
            <li>
              <NuxtLink class to="/contact">Nous écrire</NuxtLink>
            </li>
            <li>
              <a class href="#">Facebook</a>
            </li>
            <li>
              <a class href="#">Instagram</a>
            </li>
            <li>
              <a class href="#">Telegram</a>
            </li>
          </ul>
        </div>
        <div class="column footer-col">
          <h2 class="my-0">
            <strong class>
              <b-icon icon="pen" />&nbsp;&nbsp;
              Demande de crédit
            </strong>
          </h2>
          <ul>
            <li>
              <NuxtLink class to="/operations">Demander du crédit</NuxtLink>
            </li>
            <li>
              <NuxtLink class to="/complete">Completer votre dossier</NuxtLink>
            </li>
            <li>
              <NuxtLink class to="/operations">Statut de vos opérations</NuxtLink>
            </li>
            <li>
              <NuxtLink class to="/request">Envoyer du crédit</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="column footer-col">
          <h2 class="my-0">
            <strong class>
              <b-icon icon="info-circle" />&nbsp;&nbsp;
              A propos
            </strong>
          </h2>
          <ul>
            <li>
              <NuxtLink class to="/about">A propos</NuxtLink>
            </li>
            <li>
              <NuxtLink class to="/faq">FAQ</NuxtLink>
            </li>
            <li>
              <NuxtLink class to="/account">Profile</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div
      class="content v-centered has-text-centered has-background-primary has-text-white mt-6 py-2"
    >
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