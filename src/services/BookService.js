import { bookRepository } from '../repositories/BookRepository.js';

class BookService {

    getCatalog() {
        const allBooks = bookRepository.getAll();
        return allBooks.filter(book => book.active === true);
    }

    getBookById(id) {
        return bookRepository.getById(id);
    }
}

export const bookService = new BookService();