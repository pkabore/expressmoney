<template>
    <div>
      <v-app-bar
        color="transparent"
        elevate-on-scroll
        app
        flat
        dense
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        
        <v-toolbar-title>Express Money</v-toolbar-title>

        
  
        <v-spacer></v-spacer>
  
        <v-btn icon v-if="isAuthenticated">
          <v-icon>mdi-home</v-icon>
        </v-btn>
  
        <v-btn icon v-if="isAuthenticated">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
        <v-menu left bottom v-if="isAuthenticated">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item key="1" @click="handleProfile">
                <v-list-item-title>Compte</v-list-item-title>
              </v-list-item>
              <v-list-item key="2" @click="handleLogout">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
        </v-menu>
      </v-app-bar>
  
      <v-navigation-drawer
        v-model="drawer"
        absolute
        top
        temporary
      >
        <v-list
          nav
          dense
        >
          <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
          >
            <v-list-item>
                
                    <v-icon>mdi-home</v-icon>&nbsp;
                <NuxtLink to="/">
                    <v-list-item-title>Accueil</v-list-item-title>
                </NuxtLink>
            </v-list-item>
            <v-list-item>
                <v-icon>mdi-cash</v-icon>&nbsp;
                <NuxtLink to="/operations">
                    <v-list-item-title>Crédit</v-list-item-title>
                </NuxtLink>
            </v-list-item>
  
            <v-list-item>
                <v-icon>mdi-phone</v-icon>&nbsp;
                <NuxtLink to="/contact">
                    <v-list-item-title>Contact</v-list-item-title>
                </NuxtLink>
            </v-list-item>
  
            <v-list-item>
                <v-icon>mdi-information</v-icon>&nbsp;
                <NuxtLink to="/about">
                    <v-list-item-title>About</v-list-item-title>
                </NuxtLink>
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
      group () {
        this.drawer = false
      },
    },
    computed: {
        isAuthenticated() {
            return this.$auth.loggedIn
        },
        account() {
            return this.$auth.user
        }
    },
    methods: {
        handleProfile() {
            this.$router.push('/account');
        },
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
  }
</script>