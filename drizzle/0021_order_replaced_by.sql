-- An open order replaced by a newer one from the same buyer is cancelled with replaced_by = the
-- newer order's id. Payment is confirmed only by the payment site's webhook, so a transfer made to
-- the replaced order can still arrive: the webhook confirms it when it reports the exact amount and
-- no order that replaced it was paid (worker/orders.js confirmOrder). An owner-cancelled order has
-- no replaced_by and is never confirmed.
ALTER TABLE orders ADD COLUMN replaced_by TEXT;
