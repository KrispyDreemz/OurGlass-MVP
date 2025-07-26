-- CreateTable
CREATE TABLE "sponsorship_auctions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artwork_id" INTEGER NOT NULL,
    "user_id" TEXT,
    "bid_amount" REAL DEFAULT 0,
    "ends_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    CONSTRAINT "sponsorship_auctions_artwork_id_fkey" FOREIGN KEY ("artwork_id") REFERENCES "artworks"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sponsorship_auctions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "sponsorship_auctions_artwork_id_idx" ON "sponsorship_auctions"("artwork_id");

-- CreateIndex
CREATE INDEX "sponsorship_auctions_ends_at_idx" ON "sponsorship_auctions"("ends_at");
