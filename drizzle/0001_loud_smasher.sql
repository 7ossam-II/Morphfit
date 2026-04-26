CREATE TABLE `email_signups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_signups_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_signups_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `gym_locations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`redirectUrl` varchar(512) DEFAULT 'https://morphfit.shop',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gym_locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qr_scans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`locationId` int NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`redirectDestination` varchar(512),
	`userAgent` text,
	CONSTRAINT `qr_scans_id` PRIMARY KEY(`id`)
);
