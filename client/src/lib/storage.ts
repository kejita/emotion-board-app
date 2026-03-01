/**
 * Local Storage Utilities
 * ローカルストレージを使用したデータ永続化
 */

import { User, Post } from '@/types/models';

const STORAGE_KEYS = {
  USER: 'emotion-board:user',
  POSTS: 'emotion-board:posts',
};

export const storage = {
  // User operations
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user from storage:', error);
      return null;
    }
  },

  setUser: (user: User): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to set user in storage:', error);
    }
  },

  clearUser: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Failed to clear user from storage:', error);
    }
  },

  // Posts operations
  getPosts: (): Post[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      const posts = data ? JSON.parse(data) : [];
      // Convert date strings back to Date objects
      return posts.map((post: any) => ({
        ...post,
        when: new Date(post.when),
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to get posts from storage:', error);
      return [];
    }
  },

  addPost: (post: Post): void => {
    try {
      const posts = storage.getPosts();
      posts.push(post);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (error) {
      console.error('Failed to add post to storage:', error);
    }
  },

  updatePost: (postId: string, updates: Partial<Post>): void => {
    try {
      const posts = storage.getPosts();
      const index = posts.findIndex((p) => p.id === postId);
      if (index !== -1) {
        posts[index] = {
          ...posts[index],
          ...updates,
          updatedAt: new Date(),
        };
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      }
    } catch (error) {
      console.error('Failed to update post in storage:', error);
    }
  },

  deletePost: (postId: string): void => {
    try {
      const posts = storage.getPosts();
      const filtered = posts.filter((p) => p.id !== postId);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete post from storage:', error);
    }
  },

  clearPosts: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.POSTS);
    } catch (error) {
      console.error('Failed to clear posts from storage:', error);
    }
  },
};
