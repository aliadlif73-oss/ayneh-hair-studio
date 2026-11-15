-- Plans per service and the «پنل آرایشگاه» plan (owner's decision).
--
-- orders.users: how many users a «پنل آرایشگاه» order pays for (3 included; each one more is
--   charged for the whole period, worker/prices.js seat_amount). 0 on single-service orders.
--   Confirmation copies it onto the salon's plan (settings.plan.seats, worker/credits.js).
-- orders.service may now be hair (hairstyle) | color (hair colour) | nails | lashes | all.
ALTER TABLE orders ADD COLUMN users INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
-- Salons that bought from /hair before hairstyle and hair colour were sold apart offer both
-- (settings.service 'hair' meant «مدل و رنگ مو»). Write that out as settings.lines so a later
-- 'hair' (hairstyle only) can never be read the old way. worker/plans.js linesOf keeps the same
-- fallback for a row this misses.
UPDATE salons SET settings = json_set(settings, '$.lines', json('["hair","color"]'))
WHERE json_valid(settings) AND json_extract(settings, '$.service') = 'hair'
  AND json_extract(settings, '$.lines') IS NULL;
