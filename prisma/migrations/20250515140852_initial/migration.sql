-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `complaints` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('VIOLENCE', 'DISCRIMINATION', 'THREAT', 'OTHER') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `event_date` DATETIME(3) NULL,
    `attachment_url` VARCHAR(191) NULL,
    `status` ENUM('RECEIVED', 'IN_REVIEW', 'FORWARDED', 'COMPLETED') NOT NULL DEFAULT 'RECEIVED',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `admin_response` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `support_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('JURIDICO', 'PSICOLOGICO') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('RECEIVED', 'IN_REVIEW', 'FORWARDED', 'COMPLETED') NOT NULL DEFAULT 'RECEIVED',
    `user_id` INTEGER NOT NULL,
    `handled_by_id` INTEGER NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- **ADICIONAR CONSTRAINTS E CHAVES ESTRANGEIRAS**
ALTER TABLE `complaints` 
  ADD CONSTRAINT `complaints_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `support_requests` 
  ADD CONSTRAINT `support_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `support_requests` 
  ADD CONSTRAINT `support_requests_handled_by_id_fkey` FOREIGN KEY (`handled_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;