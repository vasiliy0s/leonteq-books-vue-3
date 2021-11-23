<template>
  <div class="search-filter">
    <input class="search-filter__title-input" type="text" v-model="title" name="title" @input="searchDebounced" placeholder="Search for book title...">

    <div class="search-filter__dates">
      <datepicker
        v-model="dates.publishDateFrom"
        :upper-limit="dates.publishDateTo || today"
        placeholder="From publish date"
        clearable
      />
      <datepicker
        v-model="dates.publishDateTo"
        :lower-limit="dates.publishDateFrom"
        :upper-limit="today"
        placeholder="To publish date"
        clearable
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import debounce from 'lodash.debounce'
import Datepicker from 'vue3-datepicker'

const SearchDebounceTimeoutMS = 500

export default defineComponent({
  name: 'SearchFilter',

  components: {
    Datepicker,
  },

  setup(_, { emit }) {
    const dates = reactive<Record<string, Date | null>>({
      publishDateFrom: null,
      publishDateTo: null
    })
    const title = ref('')
    const today = new Date()


    function search() {
      const filter = {
        title,
        publishDateFrom: dates.publishDateFrom?.toISOString(),
        publishDateTo: dates.publishDateTo?.toISOString(),
      }
      emit('search', filter)
    }

    const searchDebounced = debounce(search, SearchDebounceTimeoutMS)

    watch(dates, search);


    return {
      title,
      dates,
      searchDebounced,
      search,
      today
    }
  },
})
</script>

<style lang="scss" scoped>
.search-filter {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  :deep(input) {
    height: 2rem;
    padding: 0.2rem 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid var(--color-border);
  }

  &__dates {
    display: flex;
    align-items: baseline;

    & > * {
      margin-left: 1rem;
    }
  }

  :deep(.v3dp__clearable) {
    padding: 0.5rem;
    margin-left: -1.5rem;
    width: 0.5rem;
    font-style: normal;
    color: var(--color-text-secondary);
    display: inline-block;
  }
}
</style>