import { postRepository } from '../repositories/PostRepository.js';

class PostService {
    getPublishedPosts() {
        return postRepository.getAll()
            .filter(p => p.status === 'published')
            .sort((a, b) => b.id - a.id);
    }

    getPostById(id) {
        return postRepository.getById(id);
    }

    toggleLike(postId, userName) {
        const post = this.getPostById(postId);
        if (!post) return;
        
        const index = post.likedBy.indexOf(userName);
        if (index === -1) {
            post.likedBy.push(userName);
            post.likes++;
        } else {
            post.likedBy.splice(index, 1);
            post.likes--;
        }
        return post;
    }

    addComment(postId, userObj, text) {
        const post = this.getPostById(postId);
        if (!post) return;

        post.comments.push({
            id: Date.now(),
            timestamp: Date.now(),
            user: userObj.name,
            avatar: userObj.avatar,
            text: text,
            date: "Agora mesmo",
            likes: 0,
            likedBy: [],
            authorLike: false
        });
        return post;
    }
}

export const postService = new PostService();