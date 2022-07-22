-- CreateTable
CREATE TABLE `Birthday` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `date` INTEGER NOT NULL,
    `chatroomId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Birthday_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chatroom` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isEnabled` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Chatroom_id_name_key`(`id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Birthday` ADD CONSTRAINT `Birthday_chatroomId_fkey` FOREIGN KEY (`chatroomId`) REFERENCES `Chatroom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
