import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, emotionBoardUsers, emotionBoardPosts, emotionBoardLikes, InsertEmotionBoardUser, InsertEmotionBoardPost } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createEmotionBoardUser(user: InsertEmotionBoardUser) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  const result = await db.insert(emotionBoardUsers).values(user);
  return result;
}

export async function getEmotionBoardUser(userId: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }
  
  const result = await db.select().from(emotionBoardUsers).where(eq(emotionBoardUsers.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEmotionBoardPost(post: InsertEmotionBoardPost) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  const result = await db.insert(emotionBoardPosts).values(post);
  return result;
}

export async function getEmotionBoardPosts(currentUserId?: string, filterUserId?: string) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  // Get posts with user name and like count
  const postsQuery = db
    .select({
      id: emotionBoardPosts.id,
      userId: emotionBoardPosts.userId,
      boardCategory: emotionBoardPosts.boardCategory,
      emotionCategory: emotionBoardPosts.emotionCategory,
      when: emotionBoardPosts.when,
      where: emotionBoardPosts.where,
      who: emotionBoardPosts.who,
      what: emotionBoardPosts.what,
      how: emotionBoardPosts.how,
      createdAt: emotionBoardPosts.createdAt,
      updatedAt: emotionBoardPosts.updatedAt,
      userName: emotionBoardUsers.name,
      likeCount: sql<number>`(SELECT COUNT(*) FROM emotion_board_likes WHERE emotion_board_likes.postId = ${emotionBoardPosts.id})`,
      isLiked: currentUserId
        ? sql<boolean>`EXISTS(SELECT 1 FROM emotion_board_likes WHERE emotion_board_likes.postId = ${emotionBoardPosts.id} AND emotion_board_likes.userId = ${currentUserId})`
        : sql<boolean>`false`,
    })
    .from(emotionBoardPosts)
    .leftJoin(emotionBoardUsers, eq(emotionBoardPosts.userId, emotionBoardUsers.id))
    .orderBy(desc(emotionBoardPosts.createdAt));

  if (filterUserId) {
    return await postsQuery.where(eq(emotionBoardPosts.userId, filterUserId));
  }

  return await postsQuery;
}

export async function toggleEmotionBoardLike(postId: string, userId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if already liked
  const existing = await db
    .select()
    .from(emotionBoardLikes)
    .where(and(eq(emotionBoardLikes.postId, postId), eq(emotionBoardLikes.userId, userId)))
    .limit(1);

  if (existing.length > 0) {
    // Unlike
    await db
      .delete(emotionBoardLikes)
      .where(and(eq(emotionBoardLikes.postId, postId), eq(emotionBoardLikes.userId, userId)));
    return { liked: false };
  } else {
    // Like
    const { nanoid } = await import("nanoid");
    await db.insert(emotionBoardLikes).values({
      id: nanoid(),
      postId,
      userId,
    });
    return { liked: true };
  }
}

export async function deleteEmotionBoardPost(postId: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  const result = await db.delete(emotionBoardPosts).where(eq(emotionBoardPosts.id, postId));
  return result;
}
