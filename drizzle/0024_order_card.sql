-- The card shown to the buyer is picked per order from the owner's cards (app_settings
-- 'pay_cards', /admin), so a reload or a late look at the order always shows the same card.
-- Empty for older orders: they fall back to the first saved card, as before.
ALTER TABLE orders ADD COLUMN card TEXT NOT NULL DEFAULT '';
