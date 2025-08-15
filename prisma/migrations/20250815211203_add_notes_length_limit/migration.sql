/*
  Warnings:

  - You are about to alter the column `name` on the `bucket` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `name` on the `workspace` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.

*/
-- AlterTable
ALTER TABLE `bucket` MODIFY `name` VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE `workspace` MODIFY `name` VARCHAR(30) NOT NULL;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,
    `completed` BOOLEAN NOT NULL,
    `notes` VARCHAR(200) NOT NULL,
    `startDate` DATETIME(3) NULL,
    `dueDate` DATETIME(3) NULL,
    `bucketId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `taskProgressId` INTEGER NULL,
    `taskPriorityId` INTEGER NULL,
    `taskRepeatId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskPriority` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `priority` ENUM('LOW', 'MEDIUM', 'IMPORTANT', 'URGENT') NOT NULL DEFAULT 'MEDIUM',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskRepeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `repeat` ENUM('DOES_NOT_REPEAT', 'DAILY', 'WEEKDAYS', 'WEEKLY', 'MONTHLY', 'YEARLY') NOT NULL DEFAULT 'DOES_NOT_REPEAT',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_bucketId_fkey` FOREIGN KEY (`bucketId`) REFERENCES `Bucket`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_taskProgressId_fkey` FOREIGN KEY (`taskProgressId`) REFERENCES `TaskProgress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_taskPriorityId_fkey` FOREIGN KEY (`taskPriorityId`) REFERENCES `TaskPriority`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_taskRepeatId_fkey` FOREIGN KEY (`taskRepeatId`) REFERENCES `TaskRepeat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
