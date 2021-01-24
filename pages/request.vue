<template>
<section class="section">
    <h1 class="title has-text-centered">Demande de crédit</h1>
    <form autocomplete="off" class="mt-4" method="POST" @submit.prevent="submitHandler">
        <p class="help is-danger has-text-centered">{{ error }}</p>
        <b-message type="is-warning" class="my-0 is-size-7">
            <b-icon icon="information-outline" size="is-small"/> Note importante: Il s'agit ici de renseigner le nom et le prénom <br> qui ont identifié le numéro Orange Money que vous allez renseigner
        </b-message> <br>
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
            <button :class="['button mt-2 is-fullwidth is-primary', {'is-loading': isLoading}]" type="submit">Envoyer la demande</button>
        </div>
    </form>
</section>
</template>

<script>
export default {
    head:{
        title : "Demande de crédit",
        meta: [
            { hid: 'description', name: 'description', content: "Faîtes une demande de crédit chez Express Money en temps de besoins urgents." }
        ]
    },
    data() {
        return {
            error: "",
            request: {
                rfname: '',
                rlname: '',
                rnumber: '',
                amount: 0,
                pwd: ''
            },
            isLoading: false
        };
    },
    methods: {
        async submitHandler() {
            this.isLoading = true;
            if (this.request.rfname === "" || this.request.rlname === "" || this.request.rnumber === "" || this.request.pwd === ""){
                this.error = "Veuillez renseignez touts les champs";
                this.isLoading = false;
                return;
            }
            if (this.request.amount < 500){
                this.error = "Veuillez choisir un montant supérieur.";
                this.isLoading = false;
                return;
            }
            try {
                const csrf = await this.$axios.$get("/api/auth/csrf");
                this.$axios.setHeader("XSRF-TOKEN", csrf.token);
                await this.$axios.post('/api/operations/request', this.request);
                this.$router.push('/operations');
            } catch (err) {
                this.isLoading = false;
                this.error = err.response.data.message;
            }
        }
    }
};
</script>
