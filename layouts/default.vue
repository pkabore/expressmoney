<template>
  <div>
    <AppBar />
    <main class="has-background-light container">
      <Nuxt />
    </main>
    <!-- <AppFooter /> -->
  </div>
</template>

<script>
export default {};
</script>

<style lang="css">
body, html, main{
  font-family: "Roboto Condensed", sans-serif;
	background-color: #f6f6f6;
  margin: 0 !important;
  padding: 0 !important;
  max-width: 100% !important;
}

form {
  max-width: 400px;
  margin: 0 auto;
}

.card {
  background-color: inherit;
}

* {
	box-sizing: border-box !important;
}

strong {
	font-weight: normal;
}

.bg-dark {
	background-color: #343a40;
}

.border {
	border: 1px dashed #3da3b9;
	border-right: 1px dashed #3da3b9;
	border-radius: 3px;
}
</style>
