/**
 * App Context
 * アプリケーション全体の状態管理
 * tRPC APIを使用してデータベースと連携
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Post, BoardCategory, EmotionCategory, FilterCriteria } from '@/types/models';
import { trpc } from '@/lib/trpc';

const USER_ID_KEY = 'emotion_board_user_id';

interface AppContextType {
  user: User | null;
  posts: Post[];
  isLoading: boolean;
  setUser: (user: User) => void;
  addPost: (post: Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  getFilteredPosts: (filter: FilterCriteria) => Post[];
  getCurrentBoardPosts: (boardCategory: BoardCategory) => Post[];
  getCurrentEmotionPosts: (emotionCategory: EmotionCategory) => Post[];
  refetchPosts: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Normalize age from DB format ('50s+') to frontend format ('50plus')
  const normalizeAge = (age: string): string => {
    if (age === '50s+') return '50plus';
    return age;
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem(USER_ID_KEY);
    if (storedUserId) {
      const storedUserData = localStorage.getItem('emotion_board_user_data');
      if (storedUserData) {
        try {
          const parsedUser = JSON.parse(storedUserData);
          setUserState({
            ...parsedUser,
            age: normalizeAge(parsedUser.age),
            createdAt: new Date(parsedUser.createdAt),
          });
        } catch (e) {
          console.error('Failed to parse user data', e);
        }
      }
    }
    setIsInitialized(true);
  }, []);

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem(USER_ID_KEY) ?? undefined;

  // Use server-injected initial data (window.__INITIAL_POSTS__) as placeholder
  // to avoid showing a blank screen while the tRPC query loads.
  // This eliminates the JS waterfall: data is already in the HTML on first paint.
  const initialPosts = typeof window !== 'undefined'
    ? (window as unknown as { __INITIAL_POSTS__?: Record<string, unknown>[] }).__INITIAL_POSTS__
    : undefined;

  // Fetch all posts from DB via tRPC
  const { data: postsData, refetch: refetchPosts } = trpc.emotionBoard.getPosts.useQuery(
    { currentUserId },
    {
      enabled: isInitialized,
      // Use server-prefetched data as placeholder until tRPC responds
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      placeholderData: initialPosts as any,
    }
  );

  // Convert DB posts to frontend Post type
  const posts: Post[] = (postsData ?? []).map((p) => ({
    id: p.id,
    userId: p.userId,
    userName: p.userName,
    boardCategory: p.boardCategory as BoardCategory,
    emotionCategory: p.emotionCategory as EmotionCategory,
    country: p.country ?? '',
    when: new Date(p.when),
    where: p.where,
    who: p.who,
    what: p.what,
    how: p.how,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    likeCount: Number(p.likeCount ?? 0),
    isLiked: Boolean(p.isLiked),
  }));

  const createPostMutation = trpc.emotionBoard.createPost.useMutation({
    onSuccess: () => {
      refetchPosts();
    },
  });

  const deletePostMutation = trpc.emotionBoard.deletePost.useMutation({
    onSuccess: () => {
      refetchPosts();
    },
  });

  const toggleLikeMutation = trpc.emotionBoard.toggleLike.useMutation({
    onSuccess: () => {
      refetchPosts();
    },
  });

  const setUser = (newUser: User) => {
    setUserState(newUser);
    localStorage.setItem(USER_ID_KEY, newUser.id);
    localStorage.setItem('emotion_board_user_data', JSON.stringify(newUser));
  };

  const addPost = async (postData: Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      console.error('Cannot add post without user');
      return;
    }

    await createPostMutation.mutateAsync({
      userId: user.id,
      boardCategory: postData.boardCategory as 'work' | 'family' | 'school' | 'other',
      emotionCategory: postData.emotionCategory as 'happy' | 'sad' | 'tired' | 'angry',
      country: user.country ?? '',
      when: postData.when,
      where: postData.where,
      who: postData.who,
      what: postData.what,
      how: postData.how,
    });
  };

  const deletePost = async (postId: string) => {
    await deletePostMutation.mutateAsync({ postId });
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;
    await toggleLikeMutation.mutateAsync({ postId, userId: user.id });
  };

  const getFilteredPosts = useCallback((filter: FilterCriteria): Post[] => {
    return posts.filter((post) => {
      if (filter.boardCategory && post.boardCategory !== filter.boardCategory) return false;
      if (filter.emotionCategory && post.emotionCategory !== filter.emotionCategory) return false;
      if (filter.whenStart && post.when < filter.whenStart) return false;
      if (filter.whenEnd && post.when > filter.whenEnd) return false;
      if (filter.where && !post.where.toLowerCase().includes(filter.where.toLowerCase())) return false;
      if (filter.who && !post.who.toLowerCase().includes(filter.who.toLowerCase())) return false;
      if (filter.how && !post.how.toLowerCase().includes(filter.how.toLowerCase())) return false;
      return true;
    });
  }, [posts]);

  const getCurrentBoardPosts = useCallback((boardCategory: BoardCategory): Post[] => {
    return posts.filter((post) => post.boardCategory === boardCategory);
  }, [posts]);

  const getCurrentEmotionPosts = useCallback((emotionCategory: EmotionCategory): Post[] => {
    return posts.filter((post) => post.emotionCategory === emotionCategory);
  }, [posts]);

  return (
    <AppContext.Provider
      value={{
        user,
        posts,
        isLoading: !isInitialized,
        setUser,
        addPost,
        deletePost,
        toggleLike,
        getFilteredPosts,
        getCurrentBoardPosts,
        getCurrentEmotionPosts,
        refetchPosts,
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
