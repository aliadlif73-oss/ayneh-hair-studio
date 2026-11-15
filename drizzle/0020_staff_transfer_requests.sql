-- Moving a staff member's customers needs that member's own approval. The manager asks; nothing
-- moves until the member taps «موافقم» in their own bot chat. Status: pending, approved, declined,
-- expired or cancelled. `to_staff` NULL means the customers go back to the salon itself.
-- `notified` is 1 once the ask reached the member's chat (it is retried until they link the bot).
CREATE TABLE staff_transfer_requests(id TEXT PRIMARY KEY,salon_id TEXT NOT NULL REFERENCES salons(id),from_staff TEXT NOT NULL,to_staff TEXT,status TEXT NOT NULL DEFAULT 'pending',notified INTEGER NOT NULL DEFAULT 0,created_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,decided_at INTEGER);
--> statement-breakpoint
CREATE INDEX staff_transfer_salon ON staff_transfer_requests(salon_id,status);
--> statement-breakpoint
CREATE INDEX staff_transfer_from ON staff_transfer_requests(from_staff,status);
