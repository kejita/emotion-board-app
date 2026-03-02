import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { 
  createEmotionBoardUser, 
  getEmotionBoardUser, 
  createEmotionBoardPost, 
  getEmotionBoardPosts, 
  deleteEmotionBoardPost,
  toggleEmotionBoardLike,
} from "./db";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  emotionBoard: router({
    // User operations
    createUser: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        age: z.enum(["10s", "20s", "30s", "40s", "50s+"]),
        gender: z.enum(["male", "female", "other"]),
      }))
      .mutation(async ({ input }) => {
        const userId = nanoid();
        await createEmotionBoardUser({
          id: userId,
          name: input.name,
          age: input.age,
          gender: input.gender,
        });
        return { id: userId };
      }),

    getUser: publicProcedure
      .input(z.object({
        userId: z.string(),
      }))
      .query(async ({ input }) => {
        return await getEmotionBoardUser(input.userId);
      }),

    // Post operations
    createPost: publicProcedure
      .input(z.object({
        userId: z.string(),
        boardCategory: z.enum(["work", "family", "school", "other"]),
        emotionCategory: z.enum(["happy", "sad", "tired", "angry"]),
        when: z.date(),
        where: z.string().max(255).optional().default(''),
        who: z.string().max(255).optional().default(''),
        what: z.string().min(1),
        how: z.string().optional().default(''),
      }))
      .mutation(async ({ input }) => {
        const postId = nanoid();
        await createEmotionBoardPost({
          id: postId,
          userId: input.userId,
          boardCategory: input.boardCategory,
          emotionCategory: input.emotionCategory,
          when: input.when,
          where: input.where,
          who: input.who,
          what: input.what,
          how: input.how,
        });
        return { id: postId };
      }),

    getPosts: publicProcedure
      .input(z.object({
        currentUserId: z.string().optional(),
        filterUserId: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await getEmotionBoardPosts(input?.currentUserId, input?.filterUserId);
      }),

    toggleLike: publicProcedure
      .input(z.object({
        postId: z.string(),
        userId: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await toggleEmotionBoardLike(input.postId, input.userId);
      }),

    deletePost: publicProcedure
      .input(z.object({
        postId: z.string(),
      }))
      .mutation(async ({ input }) => {
        await deleteEmotionBoardPost(input.postId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
