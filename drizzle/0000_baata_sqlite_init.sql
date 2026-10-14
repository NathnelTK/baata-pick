CREATE TABLE `businessApplications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`businessName` text NOT NULL,
	`contactName` text NOT NULL,
	`phone` text NOT NULL,
	`category` text NOT NULL,
	`region` text NOT NULL,
	`location` text NOT NULL,
	`productsServices` text NOT NULL,
	`deliveryNeeds` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `business_applications_phone_unique` ON `businessApplications` (`phone`);--> statement-breakpoint
CREATE INDEX `business_applications_region_idx` ON `businessApplications` (`region`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fullName` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`region` text NOT NULL,
	`zone` text NOT NULL,
	`woreda` text NOT NULL,
	`kebele` text NOT NULL,
	`preferredDeliveryService` text NOT NULL,
	`expectedFrequency` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_phone_unique` ON `customers` (`phone`);--> statement-breakpoint
CREATE INDEX `customers_region_idx` ON `customers` (`region`);--> statement-breakpoint
CREATE INDEX `customers_location_idx` ON `customers` (`zone`,`woreda`,`kebele`);--> statement-breakpoint
CREATE TABLE `driverApplications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fullName` text NOT NULL,
	`phone` text NOT NULL,
	`region` text NOT NULL,
	`operatingArea` text NOT NULL,
	`vehicleType` text NOT NULL,
	`vehicleOwnership` text NOT NULL,
	`experience` text NOT NULL,
	`licenseDetails` text NOT NULL,
	`availability` text NOT NULL,
	`accuracyConfirmed` integer DEFAULT false NOT NULL,
	`privacyConsent` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'Pending' NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `driver_applications_phone_unique` ON `driverApplications` (`phone`);--> statement-breakpoint
CREATE INDEX `driver_applications_status_idx` ON `driverApplications` (`status`);--> statement-breakpoint
CREATE INDEX `driver_applications_region_idx` ON `driverApplications` (`region`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`passwordHash` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`lastSignedIn` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);