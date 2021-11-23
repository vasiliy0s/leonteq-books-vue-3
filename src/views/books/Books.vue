<template>
  <section class="books-shell">
    <h1 class="books-shell__title">Books</h1>
    <search-filter @search="listBooks.search($event)" />
    <p v-if="listBooks.loading" class="u-text-center">Loading...</p>
    <p v-else-if="!listBooks.books.length" class="u-text-center">No books found</p>
    <books-grid v-else :books="listBooks.books"/>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, onBeforeMount } from 'vue'
import ListBooks from '@/api/books/ListBooks'
import BooksGrid from '@/components/books/BooksGrid.vue'
import SearchFilter from '@/components/SearchFilter.vue'

export default defineComponent({
  name: 'Books',

  components: {
    BooksGrid,
    SearchFilter
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