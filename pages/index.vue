<template>
	<div>
		<section class="hero pt-6 is-primary is-large">
			<div class="hero-head">
				<h1 class="title has-text-centered">Bienvenu(e) chez Express Money</h1>
				<h2 class="subtitle has-text-centered">Express Money, Express Crédit</h2>
			</div>
			<div class="hero-body pt-2">
				<div class="container">
					<h2 class="subtitle">Vous êtes :</h2>
					<ul>
						<li>• Etudiant ?</li>
						<li>• Travailleur du secteur public ?</li>
						<li>• Travailleur du secteur privé ?</li>
					</ul>
					<h2 class="subtitle">Et vous êtes dans l’une des situations suivantes :</h2>	
					<ul>
						<li>• Vous avez du mal à finir les mois avec votre salaire ou bourse</li>
						<li>• Vous êtes en situation d’urgence et que vous n’avez d’argent pas à cet instant.</li>
						<li>• Vous voulez envoyer de l’argent à une personne en urgence.</li>
						<li>• Vous êtes travailleur et vous trouver gênant ou vous avez du mal à obtenir de l’aide financière
auprès de vos collègues en cas de besoin</li>
					</ul>
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus vitae non earum praesentium eveniet corporis vel dolore, iste asperiores cum, blanditiis id laborum ex sit delectus cumque, porro tenetur nobis.</p>
				</div>
				<p class="has-text-centered mt-5" v-if="!this.$auth.loggedIn">
					<NuxtLink to="/register" class="button is-large is-inverted is-primary"><font-awesome-icon class="fa-2x" :icon="['fas', 'hand-point-right']"  />&nbsp; Créer un compte pour commencer</NuxtLink>
				</p>
			</div>
			<div class="hero-foot">
				<p class="has-text-centered" v-if="!this.$auth.loggedIn">
					<NuxtLink to="/register" class="button is-large mb-3 is-inverted is-primary"><font-awesome-icon class="fa-2x" :icon="['fas', 'hand-point-right']"  />&nbsp; Créer un compte pour commencer</NuxtLink>
				</p>
			</div>
		</section>
		<section class="section">
			<h1 class="title has-text-centered has-text-primary mb-6">Avantages</h1>
			<div class="columns is-centered">
				<div class="column is-three-quarters-desktop">
					<div class="columns is-centered" id="css-table">
						<div class="column mt-0 pt-0 mx-0">
							<div class="card is-shadowless">
								<div class="card-content">
									<h1 class="title has-text-primary is-size-6-mobile is-size-5-tablet has-text-centered">
										<font-awesome-icon class="fa-2x" :icon="['fas', 'paper-plane']"  />&nbsp;Rapidité
									</h1>
									<h2 class="subtile mt-1 is-size-6-mobile has-text-centered"><strong>Rapidité d’obtention du prêt en 5min</strong></h2>
									<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati veritatis expedita ad ipsa quia. Provident id odio, error voluptatum earum quibusdam neque ipsum similique quasi? Minima accusantium modi voluptatum aliquid!</p>
								</div>
							</div>
						</div>
				<div class="column mt-0 pt-0 mx-0">
					<div class="card is-shadowless">
						<div class="card-content">
						<h1 class="title has-text-primary is-size-6-mobile is-size-5-tablet has-text-centered">
							<font-awesome-icon class="fa-2x" :icon="['fas', 'link']"  />&nbsp; Disponibilité</h1>
						<h2 class="subtile mt-1 is-size-6-mobile has-text-centered"><strong> Disponible 7j /7 et 24h/24</strong></h2>
						<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum velit, asperiores mollitia tempore eveniet ipsam atque culpa quidem veritatis enim! Placeat voluptatibus doloremque porro consectetur impedit eum architecto mollitia! Et!</p>
						</div>
					</div>
				</div>
			</div>
			<div class="columns">
				<div class="column mt-0 pt-0 mx-0">
					<div class="card is-shadowless">
						<div class="card-content">
						<h1 class="title has-text-primary is-size-6-mobile is-size-5-tablet has-text-centered">
							<font-awesome-icon class="fa-2x" :icon="['fas', 'percentage']" />&nbsp; Taux</h1>
						<h2 class="subtile mt-1 is-size-6-mobile has-text-centered">Taux de remboursement insignifiant <br><strong>(Juste les frais de transfert)</strong></h2>
						<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consectetur tempore, quas harum a et fugit quos nemo dolores magnam nisi suscipit cum aliquid, error vitae ipsa ipsum blanditiis amet.</p>
						</div>
					</div>
				</div>
				<div class="column mt-0 pt-0 mx-0">
					<div class="card is-shadowless">
						<div class="card-content">
						<h1 class="title has-text-primary is-size-6-mobile is-size-5-tablet has-text-centered">
							<font-awesome-icon class="fa-2x" :icon="['fas', 'check-circle']"  />&nbsp; Notre Service est en ligne</h1>
						<h2 class="subtile mt-1 is-size-6-mobile has-text-centered">Entièrement en ligne <br><strong>(Ne nécessite aucun déplacement)</strong></h2>
						<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, laboriosam asperiores illo dolore, quam ducimus, sunt expedita temporibus atque fuga est. Quas incidunt ex blanditiis non tenetur, animi consequuntur alias!</p>
						</div>
					</div>
				</div>
					</div>
				</div>
			</div>	
			<p class="has-text-centered" v-if="!this.$auth.loggedIn">
				<NuxtLink to="/register" class="button is-large is-primary"><font-awesome-icon class="fa-2x" :icon="['fas', 'hand-point-right']"  />&nbsp; Créer un compte pour commencer</NuxtLink>
			</p>
		</section>
	</div>
</template>

<script>

export default {
	auth: false,
	data() {
		return {}
	},
	computed: {
	}
}
</script>

<style scoped>
	.column {
		height: 100% !important;
		-webkit-font-smoothing: antialiased;
	}
</style>