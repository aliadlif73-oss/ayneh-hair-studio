-- Plans from the owner's price sheet, image credits, and panel sessions.
--
-- orders.kind: 'plan' (ESSENTIAL / PRO / SIGNATURE) or 'topup' (n × 10 images bought from /panel).
-- orders.service: the service page the order came from (hair | nails | lashes), so the salon is
--   provisioned with that service line.
-- orders.credits: images this order grants once it is paid.
ALTER TABLE orders ADD COLUMN kind TEXT NOT NULL DEFAULT 'plan';
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN service TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN credits INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
-- The panel cookie carries a random session token; only its hash rests here. Re-keying an
-- order deletes its sessions, so a leaked key stops working everywhere at once.
CREATE TABLE panel_sessions (
  id TEXT PRIMARY KEY,                -- sha-256 of the cookie token
  order_id TEXT NOT NULL,
  salon_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX panel_sessions_order ON panel_sessions(order_id);
--> statement-breakpoint
-- Every image credit a salon receives: +credits when a plan or a top-up is confirmed.
-- Spending is not written here: it is the count of the salon's non-failed generations since
-- its first plan started (failed images never count, the same rule as the per-person quota).
CREATE TABLE credit_ledger (
  id TEXT PRIMARY KEY,
  salon_id TEXT NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,               -- plan:<key> | topup | owner
  order_id TEXT,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX credit_ledger_salon ON credit_ledger(salon_id, created_at);
