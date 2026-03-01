CREATE TABLE `emotion_board_posts` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`boardCategory` enum('work','home','school','other') NOT NULL,
	`emotionCategory` enum('happy','sad','tired','angry') NOT NULL,
	`when` timestamp NOT NULL,
	`where` varchar(255) NOT NULL,
	`who` varchar(255) NOT NULL,
	`what` text NOT NULL,
	`how` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emotion_board_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emotion_board_users` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`age` varchar(32) NOT NULL,
	`gender` enum('male','female','other') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emotion_board_users_id` PRIMARY KEY(`id`)
);
