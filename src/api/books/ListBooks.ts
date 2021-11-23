import BookDto from '@/dto/BookDto'
import ApiClient from '../base/ApiClient'
import endOfDay from 'date-fns/endOfDay'
import startOfDay from 'date-fns/startOfDay'

interface Book extends BookDto {
  normalizedTitle: string
  publishDateMS: number
}

interface BooksListFilter {
  page: number
  pagesCount: number
  limit: number
  title?: string
  publishDateFrom?: string
  publishDateTo?: string
}

type SearchFilter = Pick<BooksListFilter, 'title' | 'publishDateFrom' | 'publishDateTo'>


export default class ListBooks extends ApiClient {
  books: Book[] = []
  loading = false
  loadingMore = false

  private booksCache: Book[] = []
  private filter: BooksListFilter = {
    page: 1,
    limit: 12,
    pagesCount: 1,
  }

  get havingMore(): boolean {
    const cursor = (this.filter.page - 1) * this.filter.limit +
      (this.filter.limit - 1) * this.filter.pagesCount
    return this.booksCache.length > cursor
  }

  async load(page?: number, limit?: number): Promise<void> {
    if (page && page >= 1) {
      this.filter.page = page
      this.filter.pagesCount = 1
    }

    if (limit && limit >= 1) this.filter.limit = limit

    try {
      // Specific realisation for the given API
      if (!this.booksCache.length) {
        await this.loadBooks()
      }

      this.filterBooks()

    } finally {
      this.loading = false
    }
  }

  private async loadBooks() {
    this.loading = true
    const books = await this.fetchJson<BookDto[]>('GET', 'Books')
    this.saveBooksCache(books)
  }

  async loadMore(): Promise<void> {
    try {
      this.loadingMore = true;
      this.filter.pagesCount++
      this.filterBooks()
    } finally {
      this.loadingMore = false;
    }
  }

  async search(filter: SearchFilter): Promise<void> {
    this.filter = { ...this.filter, ...filter }
    await this.load()
  }

  private saveBooksCache(books: BookDto[]) {
    this.booksCache = books.map(book => ({
      ...book,
      normalizedTitle: book.title.toLowerCase(),
      publishDateMS: new Date(book.publishDate).getTime()
    }))
  }

  private filterBooks() {
    let books = this.booksCache.slice()
    const { title, publishDateFrom: publishDateFrom, publishDateTo, page, limit, pagesCount } = this.filter
    const titleNormalized = title?.trim().toLowerCase() || null
    const publishDateFromMS = publishDateFrom && startOfDay(new Date(publishDateFrom)).getTime()
    const publishDateToMS = publishDateTo && endOfDay(new Date(publishDateTo)).getTime()

    if (titleNormalized || publishDateFromMS || publishDateToMS) {
      books = books.filter(book => {
        let result = true

        if (titleNormalized) {
          result = result && book.normalizedTitle.includes(titleNormalized)
        }

        if (publishDateFromMS) {
          result = result && book.publishDateMS >= publishDateFromMS
        }

        if (publishDateToMS) {
          result = result && book.publishDateMS <= publishDateToMS
        }

        return result
      })
    }

    if (page > 0 && limit >= 0) {
      const offset = (page - 1) * limit
      const fullLimit = limit * pagesCount
      books = books.slice(offset, fullLimit)
    }

    this.books = books
  }
}