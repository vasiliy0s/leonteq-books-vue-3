<template>
  <div class="books">
    <book-card v-for="book in books" :key="book.id" :book="book"/>
  </div>
</template>

<script lang="ts">
import BookDto from '@/dto/BookDto'
import { defineComponent, PropType } from 'vue'
import BookCard from './BookCard.vue'

export default defineComponent({
  name: 'BooksGrid',

  components: {
    BookCard
  },

  props: {
    books: {
      type: Array as PropType<BookDto[]>,
      requried: true
    }
  },
})
</script>

<style lang="scss" scoped>
.books {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
}
</style>