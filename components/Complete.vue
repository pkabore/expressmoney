<template>
    <form class="mt-6" action="/complete?_csrf=undefined" method="POST" enctype="multipart/form-data"><input hidden="hidden" name="_csrf" />
        <div class="field">
            <div class="control mx-1"></div>
        </div>
        <div class="field">
            <div class="control mx-1"><label class="help is-black" for="id">CNIB/Passeport:</label>
            <input required="required" type="file" id="id" name="id" />
            <label class="help is-black" for="wcard">Carte de travailleur:</label>
            <input required="required" id="wcard" type="file" name="wcard" />
            <label class="help is-black" for="codc">Attestation de prise de service:</label>
            <input required="required" id="codc" type="file" name="codc" /></div>
        </div>
        <div class="field">
            <div class="control mx-1"><label class="help is-black" for="city">Ville:</label>
            <div class="select is-fullwidth" id="city">
                <select name="city" required>
                    <option class="py-3" value="">Ville</option>
                    <option class="py-3" value="Ouagadougou">Ouagadougou</option>
                    <option class="py-3" value="Bobo Dioulasso">Bobo Dioulasso</option>
                    <option class="py-3" value="Banfora">Banfora</option>
                    <option class="py-3" value="Koudougou">Koudougou</option>
                    <option class="py-3" value="Kaya">Kaya</option>
                    <option class="py-3" value="Dori">Dori</option>
                    <option class="py-3" value="Fada N'Gourma">Fada N'Gourma</option>
                    <option class="py-3" value="Po">Po</option>
                </select>
            </div>
                <label class="help is-black" for="rib">Numéro RIB:</label>
                <input class="mt-0 input" id="rib" type="text" required="required" placeholder="Numéro RIB" name="rib" />
                <label class="help is-black" for="pass">Entrez votre mot de passe:</label>
                <input class="mt-0 input" id="pass" type="password" required="required" placeholder="Mot de passe" name="pwd" />
            </div>
        </div>
        <div class="field"><button class="button is-primary is-fullwidth" type="submit">Envoyer</button></div>
    </form>
</template>

<script>
export default {
    
}
</script>