-- Regular customers, their image packs, salon-to-salon referral rewards and generation timing.
--
-- customer_accounts: a light account for a person who tries looks on her own photo. It is bound
--   to her verified mobile when SMS is on, otherwise to the anonymous browser id. No name, no
--   password; the mobile is the one she already confirmed with the texted code.
-- customer_ledger: images she receives (+n for a paid pack, +10 for a referral reward).
--   Spending is not written here: it is the count of her non-failed generations with
--   generations.paid_by = her account (failed images never count, the same rule as salons).
--   UNIQUE(account_id, reason, order_id) makes every grant idempotent per order.
CREATE TABLE customer_accounts (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE,                      -- verified +98 mobile, NULL while browser-bound
  visitor TEXT NOT NULL DEFAULT '',       -- anonymous browser id (localStorage 'ayneh-v')
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX customer_accounts_visitor ON customer_accounts(visitor);
--> statement-breakpoint
CREATE TABLE customer_ledger (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,                   -- pack | referral | owner
  order_id TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE(account_id, reason, order_id)
);
--> statement-breakpoint
-- The customer account that paid for this image (NULL: free quota or the salon's credit).
-- A customer-paid image is never counted against a salon's plan credit.
ALTER TABLE generations ADD COLUMN paid_by TEXT;
--> statement-breakpoint
CREATE INDEX generations_paid_by ON generations(paid_by, state);
--> statement-breakpoint
-- How long a successful image took. wall_ms: from the accepted request to the stored result
-- (what the customer waits, rounded up by the page's poll interval of at most 4 s).
-- provider_ms: the image service's own figure when its task record carries one.
CREATE TABLE generation_timings (
  generation_id TEXT PRIMARY KEY,
  salon_id TEXT NOT NULL,
  line TEXT NOT NULL DEFAULT 'hair',
  kind TEXT NOT NULL DEFAULT 'single',
  model TEXT NOT NULL DEFAULT '',
  wall_ms INTEGER NOT NULL,
  provider_ms INTEGER,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX generation_timings_time ON generation_timings(created_at);
--> statement-breakpoint
-- Referral links: one code per salon (shown in /panel) or per customer account (shown on /try).
CREATE TABLE referral_codes (
  code TEXT PRIMARY KEY,
  kind TEXT NOT NULL,                     -- salon | customer
  owner_id TEXT NOT NULL,                 -- salons.id | customer_accounts.id
  created_at INTEGER NOT NULL,
  UNIQUE(kind, owner_id)
);
--> statement-breakpoint
-- The referral code an order arrived with (cookie set by ?ref= on a public page).
CREATE TABLE order_referrals (
  order_id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
-- One row per confirmed referred order; the PRIMARY KEY makes the reward idempotent per order.
-- outcome: rewarded (both get images) | buyer_only (referrer at the cap) | self | repeat | existing
CREATE TABLE referral_rewards (
  order_id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  referrer_kind TEXT NOT NULL,
  referrer_id TEXT NOT NULL,
  buyer_salon_id TEXT NOT NULL,
  outcome TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
-- A salon is gifted for being referred once, whatever happens later.
CREATE UNIQUE INDEX referral_rewards_buyer ON referral_rewards(buyer_salon_id) WHERE outcome IN ('rewarded','buyer_only');
--> statement-breakpoint
CREATE INDEX referral_rewards_referrer ON referral_rewards(referrer_kind, referrer_id, outcome);
--> statement-breakpoint
-- A regular customer's image pack is an order of kind 'customer_pack'; this names her account.
ALTER TABLE orders ADD COLUMN customer_id TEXT;
