-- Booking (نوبت‌دهی) for the four specialist editions only; the main multi-salon app never writes here.
-- A pending request holds its slot until the specialist answers or it expires after 12 hours.
-- Working hours, closed days and durations live in salons.settings (key "booking"). session_id has no
-- foreign key so the routine cleanup of expired sessions never fails on a booking.
CREATE TABLE bookings(id TEXT PRIMARY KEY,salon_id TEXT NOT NULL REFERENCES salons(id),session_id TEXT NOT NULL,phone TEXT NOT NULL,name TEXT NOT NULL,line TEXT NOT NULL,service TEXT NOT NULL DEFAULT '',note TEXT NOT NULL DEFAULT '',start_at INTEGER NOT NULL,end_at INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','rejected','cancelled','expired')),created_at INTEGER NOT NULL,decided_at INTEGER);
--> statement-breakpoint
CREATE INDEX booking_slots ON bookings(salon_id,status,start_at,end_at);
--> statement-breakpoint
CREATE INDEX booking_phone ON bookings(salon_id,phone,status,end_at);
--> statement-breakpoint
CREATE INDEX booking_session ON bookings(session_id,created_at);
--> statement-breakpoint
CREATE INDEX booking_pending ON bookings(status,created_at);
--> statement-breakpoint
CREATE TRIGGER booking_no_overlap_insert BEFORE INSERT ON bookings WHEN NEW.status IN ('pending','confirmed') BEGIN SELECT RAISE(ABORT,'BOOKING_CONFLICT') WHERE EXISTS(SELECT 1 FROM bookings b WHERE b.salon_id=NEW.salon_id AND b.status IN ('pending','confirmed') AND b.start_at<NEW.end_at AND b.end_at>NEW.start_at); END;
--> statement-breakpoint
CREATE TRIGGER booking_no_overlap_update BEFORE UPDATE OF start_at,end_at,status ON bookings WHEN NEW.status IN ('pending','confirmed') BEGIN SELECT RAISE(ABORT,'BOOKING_CONFLICT') WHERE EXISTS(SELECT 1 FROM bookings b WHERE b.id<>NEW.id AND b.salon_id=NEW.salon_id AND b.status IN ('pending','confirmed') AND b.start_at<NEW.end_at AND b.end_at>NEW.start_at); END;
