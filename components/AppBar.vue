<template>
    <div>
        <v-toolbar color="blue" dark elevate-on-scroll flat dense>
            <v-toolbar-title class="white--text">Express Money</v-toolbar-title>
            <v-divider class="mx-4" vertical></v-divider>
            <span class="subheading">Demande de Crédit</span>
            <v-spacer></v-spacer>
            <v-toolbar-items >
                <v-btn plain to="/" exact text nuxt v-if="!isAuthenticated" class="mx-0 pt-4 px-2 mb-7 d-done d-lg-block">
                    Accueil
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn plain to="/operations" text nuxt v-if="!isAuthenticated" class="mx-0 pt-4 px-2 mb-7 d-done d-lg-block">
                    Opérations
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn plain to="/contact" text nuxt v-if="!isAuthenticated" class="mx-0 pt-4 px-2 mb-7 d-done d-lg-block">
                    Contact
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn plain to="/about" text nuxt v-if="!isAuthenticated" class="mx-0 pt-4 px-2 mb-7 d-done d-lg-block">
                    À propos
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn to="/login" v-if="!isAuthenticated"  nuxt text color="white" class="m-0 pt-3 px-2 d-done d-lg-block">
                    <v-icon>mdi-login</v-icon> Se connecter
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn to="/register" v-if="!isAuthenticated" text outlined nuxt color="white" class="m-0 pt-3 px-2 d-done d-lg-block">
                    
                    <v-icon>mdi-account</v-icon> S'inscrire 
                </v-btn>
                <!-- <v-avatar v-if="isAuthenticated">
                    <v-icon dark>
                        mdi-user-circle
                    </v-icon>
                </v-avatar> -->
                <v-btn text v-if="isAuthenticated">
                    <v-badge
                        :content="messages"
                        :value="messages"
                        color="green"
                        overlap
                    >
                        <v-icon size="25">
                        mdi-bell
                        </v-icon>
                    </v-badge>
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn text v-if="isAuthenticated">
                    {{ account.name }}
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn text v-if="isAuthenticated" @click="handleLogout">
                    <v-icon>mdi-logout</v-icon> &nbsp;
                    Se déconnecter
                </v-btn>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
            </v-toolbar-items>
        </v-toolbar>
        <v-navigation-drawer v-model="drawer" absolute top temporary>
            <v-list nav dense>
                <v-list-item-group
                    v-model="group"
                    active-class="deep-purple--text text--accent-4"
                >
                    <v-list-item nuxt to="/">
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                                <v-list-item-title>Accueil</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item nuxt to="/operations">
                        <v-list-item-icon>
                            <v-icon>mdi-cash</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                                <v-list-item-title>Crédit</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item nuxt to="/contact">
                        <v-list-item-icon>
                            <v-icon>mdi-phone</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                                <v-list-item-title>Contact</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item nuxt to="/about">
                        <v-list-item-icon>
                            <v-icon>mdi-information</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>About</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>
<script>

export default {
    data: () => ({
        drawer: false,
        group: null,
    }),

    watch: {
        group() {
            this.drawer = false;
        },
    },
    computed: {
        isAuthenticated() {
            return this.$auth.loggedIn;
        },
        account() {
            return this.$auth.user;
        },
    },
    methods: {
        async handleLogout() {
            const csrf = await this.$axios.$get("/api/auth/csrf");
            const config = {
                headers: {
                    "XSRF-TOKEN": csrf.token,
                },
            };
            this.$axios.setHeader("XSRF-TOKEN", csrf.token);
            await this.$auth.logout("cookie");
        },
    },
};
</script>