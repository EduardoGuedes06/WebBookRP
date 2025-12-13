import { db } from '../infra/MockDatabase.js';

class AuthorRepository {
    getAuthor() {
        return db.data.author;
    }
}

export const authorRepository = new AuthorRepository();