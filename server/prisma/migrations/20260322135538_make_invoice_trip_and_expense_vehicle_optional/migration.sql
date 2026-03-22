-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'OPERATIONS_MANAGER', 'FINANCE_OFFICER', 'CLIENT') NOT NULL DEFAULT 'CLIENT',
    `phone` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `id` VARCHAR(191) NOT NULL,
    `plate` VARCHAR(191) NOT NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `capacity` DOUBLE NOT NULL,
    `status` ENUM('AVAILABLE', 'ON_TRIP', 'UNDER_MAINTENANCE', 'GROUNDED') NOT NULL DEFAULT 'AVAILABLE',
    `type` ENUM('TRUCK', 'PICKUP', 'MOTORBIKE', 'VAN') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Vehicle_plate_key`(`plate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `license_no` VARCHAR(191) NOT NULL,
    `license_class` VARCHAR(191) NOT NULL,
    `expiry` DATETIME(3) NOT NULL,
    `status` ENUM('AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED') NOT NULL DEFAULT 'AVAILABLE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Driver_phone_key`(`phone`),
    UNIQUE INDEX `Driver_license_no_key`(`license_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `payment_terms` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Client_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Route` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `origin` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `distance_km` DOUBLE NOT NULL,
    `duration_hrs` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trip` (
    `id` VARCHAR(191) NOT NULL,
    `vehicle_id` VARCHAR(191) NOT NULL,
    `driver_id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `route_id` VARCHAR(191) NOT NULL,
    `status` ENUM('SCHEDULED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `cargo_details` VARCHAR(191) NOT NULL,
    `pickup_date` DATETIME(3) NOT NULL,
    `delivery_date` DATETIME(3) NOT NULL,
    `actual_delivery` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `trip_id` VARCHAR(191) NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `vat` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `status` ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE') NOT NULL DEFAULT 'DRAFT',
    `paid_at` DATETIME(3) NULL,
    `mpesa_ref` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` VARCHAR(191) NOT NULL,
    `vehicle_id` VARCHAR(191) NULL,
    `trip_id` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FuelLog` (
    `id` VARCHAR(191) NOT NULL,
    `vehicle_id` VARCHAR(191) NOT NULL,
    `trip_id` VARCHAR(191) NULL,
    `litres` DOUBLE NOT NULL,
    `cost_per_litre` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `station` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Maintenance` (
    `id` VARCHAR(191) NOT NULL,
    `vehicle_id` VARCHAR(191) NOT NULL,
    `service_type` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `cost` DOUBLE NOT NULL,
    `next_service` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `type` ENUM('INFO', 'ALERT', 'SUCCESS', 'WARNING') NOT NULL DEFAULT 'INFO',
    `read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `table_name` VARCHAR(191) NOT NULL,
    `record_id` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `Driver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_route_id_fkey` FOREIGN KEY (`route_id`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `Trip`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `Trip`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuelLog` ADD CONSTRAINT `FuelLog_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuelLog` ADD CONSTRAINT `FuelLog_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `Trip`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
