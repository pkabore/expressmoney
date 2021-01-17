<template>
    <form class="mt-6" method="POST" @submit.prevent="submitHandler">
        <p class="help is-danger has-text-centered">{{ error }}</p>
        <div class="columns">
            <div class="column">
                <div class="field">
                    <label for="rfname" class="label help">Prénom du Receveur:</label>
                    <input class="input" v-model="request.rfname" type="text" id="rfname" name="rfname">
                </div>
            </div>
            <div class="column">
                <div class="field">
                    <label for="rlname" class="label help">Nom du Receveur:</label>
                    <input class="input" v-model="request.rlname" type="text" id="rlname" name="rlname">
                </div>
            </div>
        </div>
        <div class="field">
            <label for="rnumber" class="label help">Numéro Orange Money du Receveur:</label>
            <input class="input" v-model="request.rnumber" type="tel" id="rnumber" name="rnumber">
        </div>
        <div class="field">
            <label for="amount" class="label help">Montant en FCFA:</label>
            <input class="input" v-model="request.amount" type="number" id="amount" name="amount">
        </div>
        <div class="field">
            <label for="pwd" class="label help">Confirmez votre mot de passe:</label>
            <input class="input" v-model="request.pwd" type="password" id="pwd" name="pwd">
        </div>
        <div class="field">
            <button class="button is-block is-primary" type="submit">Envoyer la demande</button>
        </div>
    </form>
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
            if (this.request.rfname === "" || this.request.rlname === "" || this.request.rnumber === "" || this.request.amount < 500 || this.request.pwd === ""){
                this.error = "Veuillez renseignez touts les champs";
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
