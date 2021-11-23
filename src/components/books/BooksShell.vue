<template>
  <books-grid :books="listBooks.books"/>
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
