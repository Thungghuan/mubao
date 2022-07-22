/*
  Warnings:

  - Added the required column `name` to the `Chatroom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Chatroom` ADD COLUMN `name` VARCHAR(191) NOT NULL;
