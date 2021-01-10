<template>
	<div class="box">
		<p>{{ account }}</p>
        <b-icon
                pack="fas"
                icon="home"
                size="is-medium">
            </b-icon>
	</div>
</template>

<script>
export default {
    computed: {
        isAuthenticated() {
            return this.$auth.loggedIn;
        },
        account() {
            return this.$auth.user;
        }
    }
}
</script>