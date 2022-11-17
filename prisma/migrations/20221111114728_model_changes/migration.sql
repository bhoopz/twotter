/*
  Warnings:

  - You are about to drop the column `likes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "_UserLikedQuotes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserLikedComments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserLikedQuotes_AB_unique" ON "_UserLikedQuotes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLikedQuotes_B_index" ON "_UserLikedQuotes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserLikedComments_AB_unique" ON "_UserLikedComments"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLikedComments_B_index" ON "_UserLikedComments"("B");

-- AddForeignKey
ALTER TABLE "_UserLikedQuotes" ADD CONSTRAINT "_UserLikedQuotes_A_fkey" FOREIGN KEY ("A") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikedQuotes" ADD CONSTRAINT "_UserLikedQuotes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikedComments" ADD CONSTRAINT "_UserLikedComments_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikedComments" ADD CONSTRAINT "_UserLikedComments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
