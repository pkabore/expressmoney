<template>
<header>
    <nav class="navbar is-tansparent" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <NuxtLink class="navbar-item" to="/">Express Money</NuxtLink>
            <a class="navbar-burger" role="button" aria-label="menu" aria-expanded="false">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div class="navbar-menu pt-0">
            <div class="navbar-end">
                <NuxtLink class="navbar-item mt-0 undefined" to="/">Accueil</NuxtLink>
                <NuxtLink class="navbar-item undefined" to="/operations">Crédit</NuxtLink>
                <NuxtLink class="navbar-item undefined" to="/contact">Contact</NuxtLink>
                <NuxtLink class="navbar-item undefined" to="/about">À propos </NuxtLink>
                <div v-if="isAuthenticated" class="navbar-item">
                    <div class="field is-grouped">
                        <p class="control"><NuxtLink class="button is-primary" to="/account"><span class="icon"><i class="fas fa-sign-in-alt"></i></span><span>{{ account.name }}</span></NuxtLink></p>
                        <p class="control"><a class="button is-primary" href="#" @click="handleLogout"><span class="icon"><i class="fas fa-user-circle"></i></span><span>Se déconnecter</span></a></p>
                    </div>
                </div>
                <div v-else class="navbar-item">
                    <div class="field is-grouped">
                        <p class="control"><NuxtLink class="button is-primary" to="/login"><span class="icon"><i class="fas fa-sign-in-alt"></i></span><span>Se connecter</span></NuxtLink></p>
                        <p class="control"><NuxtLink class="button is-primary" to="/register"><span class="icon"><i class="fas fa-user-circle"></i></span><span>S'inscrire</span></NuxtLink></p>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</header>
</template>

<script>
export default {
    methods: {
        async handleLogout (){
            await this.$axios.post('/api/auth/logout').
            then(loggedOut => {
                if (loggedOut.ok)
                    this.$router.push('/login');
            }).
            catch(e => {
                // this.$buefy.toast.open({
                //     duration: 3000,
                //     message: 'Une erreur est survenue.',
                //     position: 'is-top',
                //     type: 'is-danger'
                // })
                console.log(e);
            })
            
        }
    },
    computed: {
        isAuthenticated (){
            return this.$auth.loggedIn;
        },
        account (){
            return this.$auth.account
        }
    }
}
</script>