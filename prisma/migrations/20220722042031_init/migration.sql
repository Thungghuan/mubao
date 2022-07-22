-- CreateTable
CREATE TABLE `Birthday` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nmae` VARCHAR(191) NOT NULL,
    `month` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `chatroomId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chatroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chatroomId` VARCHAR(191) NOT NULL,
    `isEnabled` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Birthday` ADD CONSTRAINT `Birthday_chatroomId_fkey` FOREIGN KEY (`chatroomId`) REFERENCES `Chatroom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
