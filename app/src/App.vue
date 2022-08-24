<template>
<div id="app">
  <IsThisMobile/>
</div>
</template>

<script>
import IsThisMobile from './components/IsThisMobile.vue'

export default {
  name: 'App',
  components: {
    IsThisMobile
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
