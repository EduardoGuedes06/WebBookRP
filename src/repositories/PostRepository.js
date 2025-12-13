import { db } from '../infra/MockDatabase.js';

class PostRepository {
    getAll() {
        return db.data.posts;
    }

    getById(id) {
        return db.data.posts.find(p => p.id === id);
    }
}

export const postRepository = new PostRepository();