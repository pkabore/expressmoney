<template>
    <header>
        <b-navbar centered fixed-top>
            <template #brand>
                <b-navbar-item tag="router-link" :to="{ path: '/' }">
                    <!-- <img
                        src="https://raw.githubusercontent.com/pkabore/assets/main/logo.ico?token=AJH7GZN5RIP2B4N6F365AJLAA3SKI"
                        alt="Demander du crédit, c'est simple et rapide avec Express Money"
                    > -->
                    Express Money
                </b-navbar-item>
            </template>
            <!-- <div class="navbar-brand">
                <NuxtLink class="navbar-item" to="/">Express Money</NuxtLink>
                <a
                    class="navbar-burger"
                    role="button"
                    aria-label="menu"
                    aria-expanded="false"
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div> -->
            <template #start>
                <NuxtLink class="navbar-item mt-0" to="/"
                    >Accueil</NuxtLink
                >
                <NuxtLink class="navbar-item" to="/operations"
                    >Crédit</NuxtLink
                >
                <NuxtLink class="navbar-item" to="/contact"
                    >Contact</NuxtLink
                >
                <NuxtLink class="navbar-item" to="/about"
                    >À propos
                </NuxtLink>
            </template>
            <template #end>
                    <div v-if="isAuthenticated" class="navbar-item">
                        <div class="field is-grouped">
                            <p class="control">
                                <NuxtLink to="/account" class="navbar-item is-inverted">
                                    <font-awesome-icon :icon="['fas', 'user-circle']"  />&nbsp;
                                    <span>{{ account.name }}</span>
                                </NuxtLink>
                            </p>
                            <p class="control">
                                <a
                                    class="navbar-item button is-primary"
                                    href="#"
                                    @click.prevent="handleLogout"
                                    ><font-awesome-icon :icon="['fas', 'sign-out-alt']"  />&nbsp;<span>Se déconnecter</span></a
                                >
                            </p>
                        </div>
                    </div>
                    <div v-else class="navbar-item">
                        <div class="field is-grouped">
                            <p class="control">
                                <NuxtLink class="button is-inverted is-primary" to="/login">
                                    <font-awesome-icon :icon="['fas', 'sign-in-alt']"  />&nbsp;<span>Se connecter</span>
                                </NuxtLink>
                            </p>
                            <p class="control">
                                <NuxtLink class="button is-primary" to="/register">
                                    <font-awesome-icon :icon="['fas', 'user-circle']"  />&nbsp;<span>S'inscrire</span>
                                </NuxtLink>
                            </p>
                        </div>
                    </div>
            </template>
        </b-navbar>
    </header>
</template>

<script>
export default {
    computed: {
        isAuthenticated() {
            return this.$auth.loggedIn
        },
        account() {
            return this.$auth.user
        }
    },
    methods: {
        async handleLogout() {
            const csrf = await this.$axios.$get("/api/auth/csrf");
            const config = {
                headers: {
                    "XSRF-TOKEN": csrf.token,
                },
            };
            console.log(this.$store.state)
            this.$axios.setHeader("XSRF-TOKEN", csrf.token);
            await this.$auth.logout("cookie");
        }
    }
};
</script>
