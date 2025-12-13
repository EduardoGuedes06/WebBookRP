import { authorRepository } from '../repositories/AuthorRepository.js';

class AuthorService {
    getData() {
        return authorRepository.getAuthor();
    }
}

export const authorService = new AuthorService();