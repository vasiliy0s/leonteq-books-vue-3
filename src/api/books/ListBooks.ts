import BookDto from '@/dto/BookDto'
import ApiClient from '../base/ApiClient'

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


export default class ListBooks extends ApiClient {
  books: Book[] = []

  private booksCache: Book[] = []
  private filter: BooksListFilter = {
    page: 1,
    limit: 10
  }

  async load(page: number = this.filter.page, limit = this.filter.limit): Promise<void> {
    this.filter = { page, limit }

    // Specific realisation for the provided API
    if (!this.booksCache.length) {
      const books = await this.fetchJson<BookDto[]>('GET', 'Books')
      this.saveBooksCache(books)
    }

    this.filtrate()
  }

  async search(filter: Pick<BooksListFilter, 'title' | 'publishDateFrom' | 'publishDateTo'>): Promise<void> {
    Object.assign(this.filter, filter)
    this.load()
  }

  private saveBooksCache(books: BookDto[]) {
    this.booksCache = books.map(book => ({
      ...book,
      normalizedTitle: book.title.toLowerCase(),
      publishDateMS: new Date(book.publishDate).getTime()
    }))
  }

  private filtrate() {
    let books = this.booksCache.slice()

    const { title, publishDateFrom: publishDateFrom, publishDateTo, page, limit } = this.filter;
    const titleNormalized = title?.trim().toLowerCase() || null
    const publishDateFromMS = publishDateFrom && new Date(publishDateFrom).getTime()
    const publishDateToMS = publishDateTo && new Date(publishDateTo).getTime()

    if (title || publishDateFromMS) {
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