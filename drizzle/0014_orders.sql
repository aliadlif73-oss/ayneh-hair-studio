-- Paid plans bought from the landing page.
--
-- The landing shows a plan and an amount only after the owner approves a price (see
-- APPROVED_PRICES in worker/orders.js). Paying is a bank transfer to the card the owner
-- sets in /admin, so there is no gateway: the customer sees the card, a countdown and
-- the amount, sends the receipt, and either the owner or the payment site's webhook
-- confirms it. Only then does the salon panel and the public salon page open.
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,             -- short code the customer quotes in the transfer
  plan TEXT NOT NULL,                   -- solo | salon | chain
  amount INTEGER NOT NULL,              -- rials, fixed at order time
  salon_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,                  -- normalised +989…
  city TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  -- open: waiting for money · reviewing: receipt/notice received · paid: confirmed by the
  -- owner or the payment site · expired: the 10-minute window closed · cancelled: replaced
  status TEXT NOT NULL DEFAULT 'open',
  expires_at INTEGER NOT NULL,
  -- The customer's own key to the salon panel. Only its hash is stored; the raw key is
  -- shown once at payment and again in the owner console for a resend.
  access_key_hash TEXT NOT NULL,
  receipt_note TEXT NOT NULL DEFAULT '', -- what the customer sent, so the owner can match it
  salon_id TEXT,                        -- filled on confirmation
  coupon TEXT NOT NULL DEFAULT '',
  discount INTEGER NOT NULL DEFAULT 0,
  confirmed_by TEXT NOT NULL DEFAULT '',
  confirmed_at INTEGER,
  webhook_seen INTEGER,                 -- set when the payment site reported this order
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX orders_time ON orders(created_at DESC);
--> statement-breakpoint
CREATE INDEX orders_phone ON orders(phone, created_at DESC);
--> statement-breakpoint
CREATE INDEX orders_status ON orders(status, expires_at);
