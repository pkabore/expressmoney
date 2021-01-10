<template>
    <div class="container">
    <div class="gr-divider"></div>
    <div class="container mt-6">
        <div class="columns is-centered is-vcentered pt-3">
            <div class="column is-third-desktop is-half-tablet is-offset-three">
                <form class="box is-radiusless" action="/complete?_csrf=undefined" method="POST" enctype="multipart/form-data"><input hidden="hidden" name="_csrf" />
                    <div class="field">
                        <div class="control mx-1"></div>
                    </div>
                    <div class="field">
                        <div class="control mx-1"><label class="help is-black" for="id">CNIB/Passeport:</label><input required="required" type="file" id="id" name="id" /><label class="help is-black" for="wcard">Carte de travailleur:</label><input required="required" id="wcard" type="file" name="wcard" /><label class="help is-black" for="codc">Attestation de prise de service:</label><input required="required" id="codc" type="file" name="codc" /></div>
                    </div>
                    <div class="field">
                        <div class="control mx-1"><label class="help is-black" for="city">Ville:</label><input class="mt-0" id="city" type="text" required="required" placeholder="Ville" name="city" /><label class="help is-black" for="rib">Numéro RIB:</label><input class="mt-0" id="rib" type="text" required="required" placeholder="Numéro RIB" name="rib" /><label class="help is-black" for="pass">Entrez votre mot de passe:</label><input class="mt-0" id="pass" type="password" required="required" placeholder="Mot de passe" name="pwd" /></div>
                    </div>
                    <div class="field"><button class="button is-primary is-fullwidth" type="submit">Envoyer</button></div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    
}
</script>