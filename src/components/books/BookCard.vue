<template>
  <div class="book">
    <h3 class="book__title">{{ book.title }}</h3>
    <div class="u-divider" />
    <p class="book__time">
      Published:
      <time :datetime="book.publishDate">{{ humanPublishDate }}</time>
    </p>
    <p class="book__descr" :title="book.description">{{ book.description }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import BookDto from '@/dto/BookDto'
import dateFormat from '@/helpers/dateFormat'

export default defineComponent({
  name: 'BookCard',

  props: {
    book: {
      type: Object as PropType<BookDto>,
      required: true
    }
  },

  setup(props) {
    const humanPublishDate = computed(() => dateFormat(props.book.publishDate))

    return {
      humanPublishDate
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/_mixins.scss";

.book {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: white;
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.15);
  }

  &__title {
    @include crop-text(2);

    margin-top: 0.5rem;
  }

  &__descr {
    @include crop-text(12);

    margin-bottom: 0;
  }

  &__time {
    color: var(--color-text-secondary);
    font-size: 0.8rem;
    margin-top: 1.2rem;
  }
}
</style>