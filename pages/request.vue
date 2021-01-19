<template>
<section class="section">
    <h1 class="title has-text-centered">Demande de crédit</h1>
    <form class="mt-6" method="POST" @submit.prevent="submitHandler">
        <p class="help is-danger has-text-centered">{{ error }}</p>
        <div class="columns my-0 py-0">
            <div class="column my-0 py-0">
                <div class="field my-0">
                    <label for="rfname" class="label help py-0 my-0">Prénom du Receveur:</label>
                    <input class="input" v-model="request.rfname" type="text" id="rfname" name="rfname">
                </div>
            </div>
            <div class="column my-0 py-0">
                <div class="field my-0">
                    <label for="rlname" class="label help py-0 my-0">Nom du Receveur:</label>
                    <input class="input" v-model="request.rlname" type="text" id="rlname" name="rlname">
                </div>
            </div>
        </div>
        <div class="field my-0">
            <label for="rnumber" class="label help py-0 my-0">Numéro Orange Money du Receveur:</label>
            <input class="input" v-model="request.rnumber" type="tel" id="rnumber" name="rnumber">
        </div>
        <div class="field my-0">
            <label for="amount" class="label help py-0 my-0">Montant en FCFA:</label>
            <input class="input" v-model="request.amount" min=0 max=50000 placeholder="10000" type="number" id="amount" name="amount">
        </div>
        <div class="field my-0">
            <label for="pwd" class="label help py-0 my-0">Confirmez votre mot de passe:</label>
            <input class="input" v-model="request.pwd" type="password" id="pwd" name="pwd">
        </div>
            <p class="has-text-centered mt-3 px-0">
                <button class="button  is-primary" type="submit">Envoyer la demande</button>
            </p>
    </form>
</section>
</template>

<script>
export default {
    data() {
        return {
            error: "",
            request: {
                rfname: '',
                rlname: '',
                rnumber: '',
                amount: 0,
                pwd: ''
            }
        };
    },
    methods: {
        async submitHandler() {
            if (this.request.rfname === "" || this.request.rlname === "" || this.request.rnumber === "" || this.request.pwd === ""){
                this.error = "Veuillez renseignez touts les champs";
                return;
            }
            if (this.request.amount < 500){
                this.error = "Veuillez choisir un montant supérieur."
                return;
            }
            try {
                const csrf = await this.$axios.$get("/api/auth/csrf");
                const config = {
                    headers: {
                    "XSRF-TOKEN": csrf.token,
                    }
                };
                this.$axios.setHeader("XSRF-TOKEN", csrf.token);
                await this.$axios.post('/api/operations/request', this.request);
                this.$router.push('/operations');
            } catch (err) {
                console.log(err)
                this.error = err.response.data.message;
            }
        }
    }
};
</script>
