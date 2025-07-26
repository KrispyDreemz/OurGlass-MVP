-- CreateTable
CREATE TABLE "ownership_auctions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artwork_id" INTEGER NOT NULL,
    "current_bid" REAL DEFAULT 0,
    "bidder_id" TEXT,
    "ends_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "ownership_auctions_artwork_id_fkey" FOREIGN KEY ("artwork_id") REFERENCES "artworks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ownership_auctions_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sales" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auction_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "final_price" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sales_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "ownership_auctions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sales_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ownership_auctions_artwork_id_idx" ON "ownership_auctions"("artwork_id");

-- CreateIndex
CREATE INDEX "ownership_auctions_ends_at_idx" ON "ownership_auctions"("ends_at");

-- CreateIndex
CREATE INDEX "sales_auction_id_idx" ON "sales"("auction_id");
