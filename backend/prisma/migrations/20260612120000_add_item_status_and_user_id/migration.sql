-- Create new OrderStatus enum with all desired values
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'IN_PRODUCTION', 'READY', 'SERVED', 'CLOSED');

-- Migrate orders.status to new enum
-- PRODUCTION + draft=true  → PENDING
-- PRODUCTION + draft=false → IN_PRODUCTION
ALTER TABLE "orders"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "orders"
  ALTER COLUMN "status" TYPE "OrderStatus_new"
    USING (
      CASE "status"::text
        WHEN 'PRODUCTION' THEN
          CASE WHEN "draft" = true THEN 'PENDING'::text ELSE 'IN_PRODUCTION'::text END
        ELSE "status"::text
      END
    )::text::"OrderStatus_new";

ALTER TABLE "orders"
  ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- Add user_id column to orders (nullable first for backfill)
ALTER TABLE "orders" ADD COLUMN "user_id" TEXT;

-- Backfill user_id with the first STAFF user found
UPDATE "orders" SET "user_id" = (SELECT id FROM "users" WHERE role = 'STAFF' LIMIT 1);

-- Make user_id NOT NULL and add foreign key
ALTER TABLE "orders" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add status column to items
ALTER TABLE "items" ADD COLUMN "status" "OrderStatus_new" NOT NULL DEFAULT 'PENDING';

-- Backfill items.status based on their order's status
UPDATE "items"
SET "status" = 'CLOSED'
WHERE "order_id" IN (SELECT id FROM "orders" WHERE status::text = 'CLOSED');

UPDATE "items"
SET "status" = 'READY'
WHERE "order_id" IN (SELECT id FROM "orders" WHERE status::text = 'READY');

UPDATE "items"
SET "status" = 'IN_PRODUCTION'
WHERE "order_id" IN (SELECT id FROM "orders" WHERE status::text = 'IN_PRODUCTION');

-- Drop old enum and rename new one
DROP TYPE "OrderStatus";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
