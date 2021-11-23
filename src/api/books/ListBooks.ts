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
  limit: number
  title?: string
  publishDateFrom?: string
  publishDateTo?: string
}

type SearchFilter = Pick<BooksListFilter, 'title' | 'publishDateFrom' | 'publishDateTo'>


export default class ListBooks extends ApiClient {
  books: Book[] = []
  loading = false

  private booksCache: Book[] = []
  private queryParams: BooksListFilter = {
    page: 1,
    limit: 12
  }

  async load(page?: number, limit?: number): Promise<void> {
    if (page && page >= 1) this.queryParams.page = page
    if (limit && limit >= 1) this.queryParams.limit = limit

    try {
      // Specific realisation for the given API
      if (!this.booksCache.length) {
        this.loading = true
        const books = await this.fetchJson<BookDto[]>('GET', 'Books')
        this.saveBooksCache(books)
      }

      this.filterBooks()

    } finally {
      this.loading = false
    }
  }

  async search(filter: SearchFilter): Promise<void> {
    this.queryParams = { ...this.queryParams, ...filter }
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
    const { title, publishDateFrom: publishDateFrom, publishDateTo, page, limit } = this.queryParams;
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
      books = books.slice(offset, limit)
    }

    this.books = books
  }
}