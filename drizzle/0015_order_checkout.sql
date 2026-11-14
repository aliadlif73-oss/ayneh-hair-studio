ALTER TABLE orders ADD COLUMN checkout_hash TEXT;
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN draft TEXT;
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN transfer_id TEXT;
--> statement-breakpoint
CREATE UNIQUE INDEX orders_transfer ON orders(transfer_id) WHERE transfer_id IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX orders_draft_slug ON orders(json_extract(draft,'$.slug')) WHERE status IN ('open','reviewing') AND draft IS NOT NULL;
--> statement-breakpoint
CREATE TABLE order_draft_assets (
  order_id TEXT NOT NULL REFERENCES orders(id),
  slot TEXT NOT NULL,
  mime TEXT NOT NULL,
  bytes BLOB NOT NULL,
  PRIMARY KEY(order_id,slot)
);
--> statement-breakpoint
CREATE TRIGGER salons_reserved_order_slug BEFORE INSERT ON salons
WHEN EXISTS (SELECT 1 FROM orders WHERE json_extract(draft,'$.slug')=NEW.slug
  AND (status='reviewing' OR (status='open' AND expires_at>unixepoch()*1000)))
BEGIN
  SELECT RAISE(ABORT, 'UNIQUE constraint failed: reserved order slug');
END;
--> statement-breakpoint
CREATE TRIGGER orders_existing_draft_slug BEFORE INSERT ON orders
WHEN NEW.draft IS NOT NULL AND EXISTS (SELECT 1 FROM salons WHERE slug=json_extract(NEW.draft,'$.slug'))
BEGIN
  SELECT RAISE(ABORT, 'UNIQUE constraint failed: salon slug');
END;
