-- AlterTable
ALTER TABLE `complaints` MODIFY `description` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `support_requests` ADD COLUMN `attendancePreference` ENUM('REMOTE', 'IN_PERSON', 'NO_PREFERENCE') NOT NULL DEFAULT 'NO_PREFERENCE',
    ADD COLUMN `professionalGenderPreference` ENUM('MALE', 'FEMALE', 'NON_BINARY', 'TRANSGENDER', 'NO_PREFERENCE') NOT NULL DEFAULT 'NO_PREFERENCE';

-- CreateTable
CREATE TABLE `complaint_locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `place` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NOT NULL,
    `complaint_id` INTEGER NULL,

    UNIQUE INDEX `complaint_locations_complaint_id_key`(`complaint_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `complaint_locations` ADD CONSTRAINT `complaint_locations_complaint_id_fkey` FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
