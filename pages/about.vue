<template>
    <div class="container">
        <div class="columns is-centered">
            <div class="column is-three-fifths-desktop is-two-thirds-tablet">
                <section class="section">
                    <h2 class="title has-text-center has-text-primary">À propos de nous</h2>
                    <p>Express Money est une innovation de jeunes socio-entrepreneurs dynamiques qui vient soutenir les
                travailleurs et ou les étudiants Boursiers qui, malgré leur salaire ou Bourse ont pour la plupart du temps
                du mal couvrir tous leurs besoins et se retrouvent très souvent dans <em>des situations d’urgence</em></p>
                </section>
                <section class="section mt-0 pt-2">
                    <h2 class="title has-text-center has-text-primary">Notre mission</h2>
                    <p>Le start up se veut pour ambition, de faciliter l’accès au fonds pour ses personnes concernées sous
                forme d’un <strong>EMPRUNT</strong> qu’ils se verront de rembourser une fois leur problème résolu selon les politiques 
                de confidentialités ou de confiance qui leur seront envoyer lors de la validation de leurs comptes par
                sms ou mail.</p>
                </section>
                <NuxtLink to="/register" class="button is-inverted is-primary"><font-awesome-icon :icon="['fas', 'hand-point-right']"  />&nbsp; Créer un compte Express Money pour commencer</NuxtLink>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    auth: false
}
</script>