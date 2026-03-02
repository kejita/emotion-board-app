import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("emotionBoard router", () => {
  describe("createUser", () => {
    it("creates a new emotion board user", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.emotionBoard.createUser({
        name: "テストユーザー",
        age: "20s",
        gender: "female",
      });

      expect(result).toHaveProperty("id");
      expect(result.id).toMatch(/^[a-z0-9_-]+$/i);
    });

    it("validates required fields - empty name should fail", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.emotionBoard.createUser({
          name: "",
          age: "20s",
          gender: "female",
        });
        expect.fail("Should have thrown validation error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("createPost", () => {
    it("creates a new emotion board post with all fields", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // First create a user
      const userResult = await caller.emotionBoard.createUser({
        name: "テストユーザー",
        age: "20s",
        gender: "female",
      });

      // Then create a post with all fields
      const postResult = await caller.emotionBoard.createPost({
        userId: userResult.id,
        boardCategory: "work",
        emotionCategory: "happy",
        when: new Date(),
        where: "会社",
        who: "上司",
        what: "プレゼンが成功した",
        how: "とても嬉しかった",
      });

      expect(postResult).toHaveProperty("id");
      expect(postResult.id).toMatch(/^[a-z0-9_-]+$/i);
    });

    it("creates a post with only required field (what)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // First create a user
      const userResult = await caller.emotionBoard.createUser({
        name: "テストユーザー最小",
        age: "30s",
        gender: "male",
      });

      // Create a post with only required field
      const postResult = await caller.emotionBoard.createPost({
        userId: userResult.id,
        boardCategory: "other",
        emotionCategory: "sad",
        when: new Date(),
        what: "最小限の投稿",
      });

      expect(postResult).toHaveProperty("id");
    });

    it("validates post fields - empty what should fail", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.emotionBoard.createPost({
          userId: "test-user",
          boardCategory: "work",
          emotionCategory: "happy",
          when: new Date(),
          what: "",
        });
        expect.fail("Should have thrown validation error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("getPosts", () => {
    it("retrieves all posts", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.emotionBoard.getPosts({});

      expect(Array.isArray(result)).toBe(true);
    });

    it("retrieves posts for a specific user via filterUserId", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Create a user
      const userResult = await caller.emotionBoard.createUser({
        name: "テストユーザー2",
        age: "30s",
        gender: "male",
      });

      // Create a post
      await caller.emotionBoard.createPost({
        userId: userResult.id,
        boardCategory: "family",
        emotionCategory: "sad",
        when: new Date(),
        where: "家",
        who: "家族",
        what: "悲しいことがあった",
        how: "落ち込んでいる",
      });

      // Get posts for this user using filterUserId
      const posts = await caller.emotionBoard.getPosts({
        filterUserId: userResult.id,
      });

      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
      expect(posts[0].userId).toBe(userResult.id);
    });
  });

  describe("deletePost", () => {
    it("deletes a post", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Create a user
      const userResult = await caller.emotionBoard.createUser({
        name: "テストユーザー3",
        age: "40s",
        gender: "other",
      });

      // Create a post
      const postResult = await caller.emotionBoard.createPost({
        userId: userResult.id,
        boardCategory: "school",
        emotionCategory: "angry",
        when: new Date(),
        where: "学校",
        who: "友人",
        what: "怒られた",
        how: "腹が立っている",
      });

      // Delete the post
      const deleteResult = await caller.emotionBoard.deletePost({
        postId: postResult.id,
      });

      expect(deleteResult).toEqual({ success: true });
    });
  });

  describe("toggleLike", () => {
    it("likes a post and then unlikes it", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Create a user
      const userResult = await caller.emotionBoard.createUser({
        name: "いいねテストユーザー",
        age: "20s",
        gender: "female",
      });

      // Create a post
      const postResult = await caller.emotionBoard.createPost({
        userId: userResult.id,
        boardCategory: "work",
        emotionCategory: "happy",
        when: new Date(),
        what: "いいねテスト投稿",
      });

      // Like the post
      const likeResult = await caller.emotionBoard.toggleLike({
        postId: postResult.id,
        userId: userResult.id,
      });
      expect(likeResult).toEqual({ liked: true });

      // Unlike the post
      const unlikeResult = await caller.emotionBoard.toggleLike({
        postId: postResult.id,
        userId: userResult.id,
      });
      expect(unlikeResult).toEqual({ liked: false });
    });
  });
});
