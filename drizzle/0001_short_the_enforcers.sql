CREATE TABLE `adminBootstrapClaims` (
	`id` int NOT NULL,
	`userId` int NOT NULL,
	`claimedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminBootstrapClaims_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_bootstrap_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `businessApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessName` varchar(160) NOT NULL,
	`contactName` varchar(120) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`category` varchar(100) NOT NULL,
	`region` varchar(100) NOT NULL,
	`location` varchar(180) NOT NULL,
	`productsServices` text NOT NULL,
	`deliveryNeeds` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `businessApplications_id` PRIMARY KEY(`id`),
	CONSTRAINT `business_applications_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(120) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`email` varchar(320),
	`region` varchar(100) NOT NULL,
	`zone` varchar(100) NOT NULL,
	`woreda` varchar(100) NOT NULL,
	`kebele` varchar(100) NOT NULL,
	`preferredDeliveryService` varchar(120) NOT NULL,
	`expectedFrequency` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `driverApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(120) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`region` varchar(100) NOT NULL,
	`operatingArea` varchar(180) NOT NULL,
	`vehicleType` varchar(80) NOT NULL,
	`vehicleOwnership` varchar(80) NOT NULL,
	`experience` text NOT NULL,
	`licenseDetails` varchar(300) NOT NULL,
	`availability` varchar(100) NOT NULL,
	`accuracyConfirmed` boolean NOT NULL DEFAULT false,
	`privacyConsent` boolean NOT NULL DEFAULT false,
	`status` enum('Pending','Under Review','Approved','Rejected') NOT NULL DEFAULT 'Pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `driverApplications_id` PRIMARY KEY(`id`),
	CONSTRAINT `driver_applications_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE INDEX `business_applications_region_idx` ON `businessApplications` (`region`);--> statement-breakpoint
CREATE INDEX `customers_region_idx` ON `customers` (`region`);--> statement-breakpoint
CREATE INDEX `customers_location_idx` ON `customers` (`zone`,`woreda`,`kebele`);--> statement-breakpoint
CREATE INDEX `driver_applications_status_idx` ON `driverApplications` (`status`);--> statement-breakpoint
CREATE INDEX `driver_applications_region_idx` ON `driverApplications` (`region`);