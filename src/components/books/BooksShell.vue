<template>
  <section class="books-shell">
    <h1 class="books-shell__title">Books</h1>
    <books-grid :books="listBooks.books"/>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, onBeforeMount } from 'vue'
import ListBooks from '@/api/books/ListBooks'
import BooksGrid from './BooksGrid.vue'

export default defineComponent({
  components: {
    BooksGrid
  },

  setup() {
    const listBooks = reactive(new ListBooks())

    onBeforeMount(() => {
      listBooks.load(1)
    })

    return {
      listBooks
    }
  }
})
</script>

<style lang="scss" scoped>
.books-shell {
  padding: 0 2rem;

  &__title {
    margin-bottom: 2.4rem;
  }
}
</style>