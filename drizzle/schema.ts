import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Emotion Board Users - Anonymous users with age and gender
 * Separate from OAuth users for anonymous posting
 */
export const emotionBoardUsers = mysqlTable("emotion_board_users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Nickname
  age: varchar("age", { length: 32 }).notNull(), // e.g., "10s", "20s", "30s", "40s", "50s+"
  gender: mysqlEnum("gender", ["male", "female", "other"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmotionBoardUser = typeof emotionBoardUsers.$inferSelect;
export type InsertEmotionBoardUser = typeof emotionBoardUsers.$inferInsert;

/**
 * Emotion Board Posts - User posts with 5W1H structure
 */
export const emotionBoardPosts = mysqlTable("emotion_board_posts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  boardCategory: mysqlEnum("boardCategory", ["work", "family", "school", "other"]).notNull(),
  emotionCategory: mysqlEnum("emotionCategory", ["happy", "sad", "tired", "angry"]).notNull(),
  // 5W1H fields
  when: timestamp("when").notNull(), // When did it happen
  where: varchar("where", { length: 255 }).notNull(), // Where did it happen
  who: varchar("who", { length: 255 }).notNull(), // Who was involved
  what: text("what").notNull(), // What happened (free text)
  how: text("how").notNull(), // How did you feel
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmotionBoardPost = typeof emotionBoardPosts.$inferSelect;
export type InsertEmotionBoardPost = typeof emotionBoardPosts.$inferInsert;

/**
 * Emotion Board Likes - Users liking posts
 */
export const emotionBoardLikes = mysqlTable("emotion_board_likes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  postId: varchar("postId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmotionBoardLike = typeof emotionBoardLikes.$inferSelect;
export type InsertEmotionBoardLike = typeof emotionBoardLikes.$inferInsert;

// Relations
export const emotionBoardPostsRelations = relations(emotionBoardPosts, ({ one }) => ({
  user: one(emotionBoardUsers, {
    fields: [emotionBoardPosts.userId],
    references: [emotionBoardUsers.id],
  }),
}));

export const emotionBoardUsersRelations = relations(emotionBoardUsers, ({ many }) => ({
  posts: many(emotionBoardPosts),
}));