import { db } from '../infra/MockDatabase.js';

class BookRepository {
    
    getAll() {
        return db.data.books;
    }

    getById(id) {
        return db.data.books.find(book => book.id === id);
    }
}

export const bookRepository = new BookRepository();