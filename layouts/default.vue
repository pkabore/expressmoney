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

<style>
body, html, main{
  font-family: "Baloo 2", cursive, sans-serif;
	background-color: #f6f6f6;
  margin: 0 !important;
  padding: 0 !important;
  max-width: 100% !important;
}

form {
  max-width: 400px;
  margin: 0 auto;
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

.bold-text{
  font-weight: bold;
}

.list-item {
  padding: 7px 0px;
  margin: 0;
  border-bottom: 2px dotted #e0e0e0;
}

.input:focus{
  box-shadow: none;
}
</style>
