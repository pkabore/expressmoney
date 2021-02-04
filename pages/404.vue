<template>
    <section class="section is-vcentered">
        <div class="columns">
            <div class="column">
                <h1 class="title has-text-centered">404</h1>
                <p class="has-text-centered">Page non trouvée.</p>
                <p class="has-text-centered">
                    <NuxtLink to="/" class="has-text-link">Retour à la page d'accueil.</NuxtLink>
                </p>
            </div>
        </div>
    </section>    
</template>

<script>
export default {
    auth: false
}
</script>