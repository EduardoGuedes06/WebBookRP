import { db } from '../infra/MockDatabase.js';

class BookService {

    getAll() {
        return db.data.books;
    }


    getCatalog() {
        return db.data.books.filter(b => b.active);
    }


    getPublicBooks() {
        return this.getCatalog();
    }

    getById(id) {
        return db.data.books.find(b => b.id === id);
    }

    save(data) {
        const book = {
            ...data,
            price: parseFloat(data.price),
            promoPrice: data.promoPrice ? parseFloat(data.promoPrice) : null,
            active: data.active === true || data.active === 'on',
            isPromotion: data.isPromotion === true || data.isPromotion === 'on'
        };

        if (data.id) {
            const index = db.data.books.findIndex(b => b.id === data.id);
            if (index !== -1) {
                db.data.books[index] = { ...db.data.books[index], ...book };
                return true;
            }
        } else {
            book.id = Date.now().toString();
            if (!book.cover) book.cover = 'https://placehold.co/300x450/333/FFF?text=Capa';
            db.data.books.unshift(book);
            return false;
        }
    }

    delete(id) {
        db.data.books = db.data.books.filter(b => b.id !== id);
    }
}

export const bookService = new BookService();