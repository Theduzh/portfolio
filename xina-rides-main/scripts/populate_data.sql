--
DROP SCHEMA IF EXISTS xinarides;
CREATE SCHEMA xinarides;
use xinarides;

-- accountTypes
CREATE TABLE `accounttypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `accountType` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `accountTypes` (`id`, `accountType`) 
VALUES (1, 'user'), (2, 'admin');

-- bikes
CREATE TABLE `bikes` (
  `bikeId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `currentlyInUse` tinyint(1) NOT NULL,
  `rentalPrice` decimal(5,2) NOT NULL,
  `condition` text,
  `bikeLat` decimal(10,6) DEFAULT NULL,
  `bikeLon` decimal(10,6) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`bikeId`),
  UNIQUE KEY `bikeId` (`bikeId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `bikes` (`bikeId`, `name`, `currentlyInUse`, `rentalPrice`, `condition`, `bikeLat`, `bikeLon`, `createdAt`, `updatedAt`)
VALUES 
  (1, 'Bike @ AMKHub',                 1, 1.25, 'Ready to go!',       1.369240, 103.849376, '2023-08-02 21:08:55', '2023-08-02 21:09:48'),
  (2, 'Bike @ AMKHub',                 0, 1.83, 'Bike chain loose',   1.368941, 103.848036, '2023-08-02 21:08:55', '2023-08-02 21:09:48'),
  (3, 'MacRitchie Nature Trail Rides', 1, 1.33, '',                   1.353844, 103.818934, '2023-08-02 21:08:55', '2023-08-02 21:09:48'),
  (4, 'Rail Corridor Biking Trips',    1, 2.45, 'Very dirty',         1.351064, 103.771813, '2023-08-02 21:08:55', '2023-08-02 21:09:48'),
  (5, 'XinaRideAnywhere!',             0, 0.75, 'Needs maintenance.', 1.421444, 103.889584, '2023-08-02 21:08:55', '2023-08-02 21:09:48'),
  (6, 'XinaRideAnywhere!',             1, 0.83, '',                   1.403443, 103.888200, '2023-08-02 21:08:55', '2023-08-02 21:09:48'),
  (7, 'Bike @ Punggol',                1, 1.55, '',                   1.410685, 103.906288, '2023-08-02 21:08:55', '2023-08-02 21:09:48');



-- promotion
CREATE TABLE `promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promotion_name` varchar(255) NOT NULL,
  `promotion_description` text NOT NULL,
  `promotion_code` varchar(255) NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `discount_amount` float NOT NULL,
  `total_uses` int NOT NULL,
  `image_file` varchar(255) DEFAULT NULL,
  `card_image` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `promotions` (
    `promotion_name`,
    `promotion_description`,
    `promotion_code`,
    `start_date`,
    `end_date`,
    `start_time`,
    `end_time`,
    `discount_amount`,
    `total_uses`,
    `image_file`,
    `card_image`,
    `is_deleted`,
    `createdAt`,
    `updatedAt`
)
VALUES
  ('XINA X Red Cross', 'Support the Red Cross by renting our bikes!', 'REDCROSS', '2023-07-30', '2023-08-20', '10:30:00', '18:30:00', 20.0, 3, 'ZB7ER1GaMj.png', 'L1a89Tvx5-.jpg', 0, NOW(), NOW()),
  ('MASSIVE DISCOUNT WEEK', 'BIG SALES ALL AROUND THIS WEEK! TRY NOW!', '50OFF', '2023-08-05', '2023-08-15', '11:00:00', '19:00:00', 50.0, 3, '10L8FhOtnM.png', 'L1a89Tvx5-.jpg', 0, NOW(), NOW());

-- accounts
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `dateOfBirth` datetime DEFAULT NULL,
  `xcredit` int NOT NULL DEFAULT '0',
  `xcreditEarned` int NOT NULL DEFAULT '0',
  `phoneNo` varchar(255) DEFAULT NULL,
  `aboutMe` varchar(255) DEFAULT NULL,
  `profilePic` varchar(255) DEFAULT NULL,
  `twoFAEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `wallet` decimal(10,2) NOT NULL DEFAULT '0.00',
  `stripe_account_id` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `AccountTypeId` int DEFAULT NULL,
  `accountType` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `AccountTypeId` (`AccountTypeId`),
  KEY `accountType` (`accountType`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`AccountTypeId`) REFERENCES `accounttypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`accountType`) REFERENCES `accounttypes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `xcredit`, `xcreditEarned`, `twoFAEnabled`, `createdAt`, `updatedAt`, `accountType`, `accountTypeId`)
VALUES 
  -- account 1 password: hyphen.codes@gmail.com1
  -- account 2 password: xinarides@gmail.com1
  (1, 'Jan', 'Krishna', 'hyphen.codes@gmail.com', '$2b$10$qEv7TaUSqLJW6k6iyRd9/uUhOqaU1tDhugf6pgUmaOIM5/hpgbUPC', 600, 600, 0, '2023-08-03 14:52:58', '2023-08-03 15:59:39', 1, 1),
  (2, 'XinaRides', 'Admin', 'xinarides@gmail.com', '$2b$10$QmssBkng1zLiUF9Qy8joDO424gbZC8z3cKpFT4xcBfz3pBfi/my7W', 600, 600, 0, '2023-08-03 15:00:56', '2023-08-13 18:08:18', 2, 2);

-- orders
CREATE TABLE `orders` (
  `orderId` int NOT NULL AUTO_INCREMENT,
  `rentalStartDate` datetime DEFAULT NULL,
  `rentalEndDate` datetime DEFAULT NULL,
  `rentalDuration` int DEFAULT NULL,
  `orderTotal` decimal(7,2) DEFAULT NULL,
  `orderNotes` varchar(255) DEFAULT NULL,
  `orderPaymentStatus` varchar(255) NOT NULL,
  `orderStatus` varchar(255) NOT NULL,
  `orderPaymentMethod` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bikeId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`orderId`),
  UNIQUE KEY `orderId` (`orderId`),
  KEY `bikeId` (`bikeId`),
  KEY `userId` (`userId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`bikeId`) REFERENCES `bikes` (`bikeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO orders
VALUES 
  ('1', '2023-08-12 00:32:05', NULL, NULL, NULL, '', 'UNPAID', 'ACTIVE', '', '2023-08-12 00:32:05', '2023-08-13 22:04:29', 3, 1),
  ('2', '2023-08-12 00:32:05', NULL, NULL, NULL, '', 'UNPAID', 'ACTIVE', '', '2023-08-12 00:32:05', '2023-08-13 22:04:29', 4, 1),
  ('3', '2023-08-12 00:32:05', NULL, NULL, NULL, '', 'UNPAID', 'ACTIVE', '', '2023-08-12 00:32:05', '2023-08-13 22:04:29', 1, 1),
  ('4', '2023-08-12 00:32:05', NULL, NULL, NULL, '', 'UNPAID', 'ACTIVE', '', '2023-08-12 00:32:05', '2023-08-13 22:04:29', 7, 1),
  ('5', '2023-08-12 00:32:05', NULL, NULL, NULL, '', 'UNPAID', 'ACTIVE', '', '2023-08-12 00:32:05', '2023-08-13 22:04:29', 6, 1);

-- rewards
CREATE TABLE `rewards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `header` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `titleSubhead` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount` decimal(5,2) NOT NULL,
  `xcredit` int NOT NULL,
  `expiryDate` date NOT NULL,
  `imageFile` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO rewards
VALUES 
  ('1', 'Green day', 'Event', 'Go Green, Save Green', 'Embrace eco-friendly journeys with discounted fares.', 'Enjoy 15% off rides on Green Day for sustainable travel.', '15.00', '150', '2023-09-24', "OY0UmuYG_M.png", '2023-08-09 15:12:48', '2023-08-24 15:12:48', NULL),
  ('2', 'Summer Holidays', 'Holiday', 'Sun-soaked Savings', 'Unleash the summer vibe with discounted fares.', ' Get 20% off on all rides during the season.', '20.00', '200', '2023-09-24', "ZMOlGwBKPB.png", '2023-08-11 15:12:48', '2023-08-22 15:12:48', NULL),
  ('3', 'Valentine Special', 'Event', 'Love on Wheels', 'New date idea!', 'Share a ride with your loved one this Valentine', '14.00', '140', '2023-09-24', "hiB_MkSACt.jpg", '2023-08-11 15:12:48', '2023-08-27 15:12:48', NULL),
  ('4', 'Back-to-School', 'Event', 'Learning Journeys', 'Gear up for school with affordable rides for students.', '15% discount on rides during the back-to-school season.', '15.00', '150', '2023-09-24', "bAoWrvairy.png", '2023-08-10 15:12:48', '2023-08-27 15:12:48', NULL),
  ('5', 'Halloween Haunt', 'Event', 'Spooky Rides Await', 'Get in the Halloween spirit with eerie ride discounts.', '18% off on rides for a spooky adventure.', '18.00', '180', '2023-09-24', "X-GwhPU80S.png", '2023-08-11 15:12:48', '2023-08-27 15:12:48', NULL),
  ('6', 'Thanksgiving', 'Holiday', 'Grateful Journeys', 'Give thanks and save on travel during Thanksgiving.', 'Enjoy 20% off rides to celebrate the holiday.', '20.00', '200', '2023-09-24', "jiUeCEZ0Xm.png", '2023-08-12 15:12:48', '2023-08-27 15:12:48', NULL),
  ('7', 'Black Friday', 'Event', 'Mega Shopping Ride', 'Navigate the Black Friday sales with discounted rides.', '30% off rides for an ultimate shopping experience.', '30.00', '300', '2023-09-24', "_lmMz-aa0s.png", '2023-08-12 15:12:48', '2023-08-27 15:12:48', NULL),
  ('8', 'Chinese New Year', 'Holiday', 'Prosperous Rides', 'Get your relatives out to ride with you.', 'Usher in the Lunar New Year with abundant discounts!', '77.00', '77', '2023-09-24', "hfRlc7FiIC.png", '2023-08-14 15:12:48', '2023-08-27 15:12:48', NULL);

-- user rewards
CREATE TABLE `user_rewards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `RewardId` int DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  `Used` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_Rewards_UserId_RewardId_unique` (`RewardId`,`UserId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `user_rewards_ibfk_1` FOREIGN KEY (`RewardId`) REFERENCES `rewards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_rewards_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- user promos
CREATE TABLE `user_promotions` (
  `user_uses` int NOT NULL,
  `promotion_code` varchar(255) NOT NULL,
  `stripe_coupon_id` varchar(255) DEFAULT NULL,
  `stripe_promotion_id` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PromotionId` int NOT NULL,
  `UserId` int NOT NULL,
  PRIMARY KEY (`PromotionId`,`UserId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `user_promotions_ibfk_1` FOREIGN KEY (`PromotionId`) REFERENCES `promotions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_promotions_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- fault reports
CREATE TABLE `faultreports` (
  `faultReportId` int NOT NULL AUTO_INCREMENT,
  `faultReportDescription` varchar(255) NOT NULL,
  `faultReportStatus` varchar(255) NOT NULL,
  `faultReportDate` datetime NOT NULL,
  `faultReportResolvedDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bikeId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`faultReportId`),
  UNIQUE KEY `faultReportId` (`faultReportId`),
  KEY `bikeId` (`bikeId`),
  KEY `userId` (`userId`),
  CONSTRAINT `faultreports_ibfk_1` FOREIGN KEY (`bikeId`) REFERENCES `bikes` (`bikeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `faultreports_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO FaultReports (`faultReportDescription`, `faultReportStatus`, `faultReportDate`, `faultReportResolvedDate`, `bikeId`, `userId`, `createdAt`, `updatedAt`)
VALUES
  ('Chain rattling', 'OPEN', '2023-08-12 00:32:05', NULL, 3, 1, '2023-08-12 00:32:05', '2023-08-12 00:32:05'),
  ('Bike wheel flat', 'IN PROGRESS', '2023-08-12 00:32:05', NULL, 4, 1, '2023-08-12 00:32:05', '2023-08-12 00:32:05'),
  ('Brake not working', 'OPEN', '2023-08-12 00:32:05', NULL, 2, 1, '2023-08-12 00:32:05', '2023-08-12 00:32:05'),
  ('Bike very dirty', 'RESOLVED', '2023-08-12 00:32:05', '2023-08-13 22:04:29', 3, 1, '2023-08-12 00:32:05', '2023-08-12 00:32:05'),
  ('Frame is rusty', 'IN PROGRESS', '2023-08-12 00:32:05', NULL, 6, 1, '2023-08-12 00:32:05', '2023-08-12 00:32:05');

-- notifs
CREATE TABLE `notifications` (
  `notificationId` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`notificationId`),
  UNIQUE KEY `notificationId` (`notificationId`),
  KEY `userId` (`userId`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO Notifications (`type`, `message`, `status`, `userId`, `createdAt`, `updatedAt`)
VALUES
  ('RENTAL', 'Your rental is confirmed.', 'UNREAD', 1, '2023-08-12 00:32:05', '2023-08-12 00:32:05'),
  ('RETURN', 'Please return the bike by the due date.', 'UNREAD', 1, '2023-08-12 00:32:05', '2023-08-12 00:32:05'),
  ('CANCELLED', 'Your order has been cancelled.', 'UNREAD', 1, '2023-08-12 00:32:05', '2023-08-12 00:32:05'),
  ('RENTAL', 'Rental successful.', 'READ', 1, '2023-08-12 00:32:05', '2023-08-12 00:32:05'),
  ('RETURN', 'Bike returned successfully.', 'READ', 1, '2023-08-12 00:32:05', '2023-08-12 00:32:05');

