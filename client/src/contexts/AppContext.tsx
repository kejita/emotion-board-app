/**
 * App Context
 * アプリケーション全体の状態管理
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, BoardCategory, EmotionCategory, FilterCriteria } from '@/types/models';
import { storage } from '@/lib/storage';
import { nanoid } from 'nanoid';

interface AppContextType {
  user: User | null;
  posts: Post[];
  setUser: (user: User) => void;
  addPost: (post: Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  deletePost: (postId: string) => void;
  getFilteredPosts: (filter: FilterCriteria) => Post[];
  getCurrentBoardPosts: (boardCategory: BoardCategory) => Post[];
  getCurrentEmotionPosts: (emotionCategory: EmotionCategory) => Post[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [posts, setPostsState] = useState<Post[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from storage
  useEffect(() => {
    const storedUser = storage.getUser();
    const storedPosts = storage.getPosts();
    setUserState(storedUser);
    setPostsState(storedPosts);
    setIsInitialized(true);
  }, []);

  const setUser = (newUser: User) => {
    setUserState(newUser);
    storage.setUser(newUser);
  };

  const addPost = (postData: Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      console.error('Cannot add post without user');
      return;
    }

    const newPost: Post = {
      ...postData,
      id: nanoid(),
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setPostsState((prev) => [...prev, newPost]);
    storage.addPost(newPost);
  };

  const deletePost = (postId: string) => {
    setPostsState((prev) => prev.filter((p) => p.id !== postId));
    storage.deletePost(postId);
  };

  const getFilteredPosts = (filter: FilterCriteria): Post[] => {
    return posts.filter((post) => {
      if (filter.boardCategory && post.boardCategory !== filter.boardCategory) {
        return false;
      }
      if (filter.emotionCategory && post.emotionCategory !== filter.emotionCategory) {
        return false;
      }
      if (filter.whenStart && post.when < filter.whenStart) {
        return false;
      }
      if (filter.whenEnd && post.when > filter.whenEnd) {
        return false;
      }
      if (filter.where && !post.where.toLowerCase().includes(filter.where.toLowerCase())) {
        return false;
      }
      if (filter.who && !post.who.toLowerCase().includes(filter.who.toLowerCase())) {
        return false;
      }
      if (filter.how && !post.how.toLowerCase().includes(filter.how.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const getCurrentBoardPosts = (boardCategory: BoardCategory): Post[] => {
    return posts.filter((post) => post.boardCategory === boardCategory);
  };

  const getCurrentEmotionPosts = (emotionCategory: EmotionCategory): Post[] => {
    return posts.filter((post) => post.emotionCategory === emotionCategory);
  };

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        user,
        posts,
        setUser,
        addPost,
        deletePost,
        getFilteredPosts,
        getCurrentBoardPosts,
        getCurrentEmotionPosts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
