<template>
<div class="columns is-centered is-vcentered pt-6">
  <div class="column is-one-third-desktop is-half-tablet is-offset-three">
    <form @submit.prevent="handleLogin" method="POST">
      <h2 class="title has-text-centered"><span class="icon"><i class="fas fa-sign-in-alt"></i></span><span>&nbsp; Se connecter</span></h2>
      <p class="has-text-centered help is-danger" id="errorMessage">{{ error }}</p>
      <div class="field">
        <div class="control mx-1">
          <label class="help is-black" for="tel">N° de téléphone:</label>
          <input class="input" v-model="login.tel" id="tel" type="tel" required="required" placeholder="Numéro de téléphone" name="tel" value=""/>
          <label class="help is-black" for="pass">Mot de passe:</label>
          <input class="input" v-model="login.pwd" id="pass" type="password" required="required" placeholder="Mot de passe" name="pwd" value=""/>
          <button class="mt-2 button is-primary is-fullwidth" type="submit">Se connecter</button>
        </div>
      </div>
      <p class="has-text-centered help is-info"><NuxtLink to="/register">Créer un compte</NuxtLink></p>
    </form>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      login: {
        tel: '',
        pwd: ''
      },
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const csrf = await this.$axios.$get('/api/auth/csrf');
        //console.log(csrf);
        const config = {
            headers: {
                "XSRF-TOKEN": csrf.token
            }
        };
        this.$axios.setHeader('XSRF-TOKEN', csrf.token);
        let response = await this.$auth.loginWith('cookie', { data: this.login });
        console.log(response)
      } catch (err) {
        console.log(err);
        this.error = err.response.data.err;
      }
    }
  }
}
</script>