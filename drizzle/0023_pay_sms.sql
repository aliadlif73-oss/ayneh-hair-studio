-- Bank deposit SMS forwarded from the owner's phone (worker/paysms.js, POST /api/pay/sms).
-- Each SMS is stored once by the hash of its text, so a resent or double-forwarded message
-- never confirms twice. Only the amount and the outcome are kept, never the balance or the text.
CREATE TABLE pay_sms (
  id TEXT PRIMARY KEY,                  -- SHA-256 of the normalised SMS text
  amount INTEGER NOT NULL,              -- rials, as the bank reported it
  result TEXT NOT NULL,                 -- paid | none | many | closed | error
  order_id TEXT,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX pay_sms_time ON pay_sms(created_at DESC);
