<template>
  <BooksShell />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BooksShell from './views/books/Books.vue'

export default defineComponent({
  name: 'LeonteqBooksApp',

  components: {
    BooksShell
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-text);
  max-width: 1200px;
  margin: 60px auto;
}
</style>
