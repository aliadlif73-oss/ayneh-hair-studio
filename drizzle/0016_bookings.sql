-- Booking & follow-up for salons on PRO and SIGNATURE (owner's request).
-- A booking is a day and time the salon set for a customer, usually from one of her requests.
-- The old `appointments` table belongs to the retired booking system (foreign keys to
-- requests/staff and overlap triggers) and is left untouched.
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  salon_id TEXT NOT NULL,
  lead_id TEXT UNIQUE,                 -- the request it came from, if any
  staff_id TEXT,                       -- the stylist, when the salon has a team
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  starts_at INTEGER NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 60,
  note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled | done | no_show | cancelled
  reminded_at INTEGER,                 -- the day-before reminder went out
  followed_at INTEGER,                 -- the after-visit follow-up went out
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX bookings_salon_time ON bookings(salon_id, starts_at);
--> statement-breakpoint
CREATE INDEX bookings_due ON bookings(status, starts_at);
