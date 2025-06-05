/*
  Warnings:

  - You are about to drop the column `place` on the `complaint_locations` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `complaints` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `complaint_locations` DROP COLUMN `place`,
    ADD COLUMN `location` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `complaints` DROP COLUMN `location`;
