CREATE TABLE `emotion_board_likes` (
	`id` varchar(64) NOT NULL,
	`postId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emotion_board_likes_id` PRIMARY KEY(`id`)
);
