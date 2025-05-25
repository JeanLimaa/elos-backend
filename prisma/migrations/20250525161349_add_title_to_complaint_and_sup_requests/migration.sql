/*
  Warnings:

  - Added the required column `title` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `SupportRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `complaint` ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `supportrequest` ADD COLUMN `title` VARCHAR(191) NOT NULL;
