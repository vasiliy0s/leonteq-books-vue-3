<template>
  <section class="books">
    <h1 class="books__title">Books</h1>
    <search-filter @search="listBooks.search($event)" />

    <div>
      <p v-if="listBooks.loading" class="u-text-center">Loading...</p>
      <p v-else-if="!listBooks.books.length" class="u-text-center">No books found</p>
      <books-grid v-else :books="listBooks.books"/>
    </div>

    <footer class="books__footer" v-if="listBooks.havingMore">
      <p v-if="listBooks.loadingMore" class="u-text-center">Loading...</p>

      <button v-else class="c-button" @click="listBooks.loadMore()" :disabled="listBooks.loading">
        Load more
      </button>
    </footer>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, onBeforeMount } from 'vue'
import ListBooks from '@/api/books/ListBooks'
import BooksGrid from '@/components/books/BooksGrid.vue'
import SearchFilter from '@/sections/SearchFilter.vue'

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
.books {
  padding: 0 2rem;

  &__title {
    margin-bottom: 2.4rem;
  }

  &__footer {
    margin: 2rem auto;
    text-align: center;
  }
}
</style>