-- Melipayamak SMS: customer mobile verification (OTP) before image generation, and salon
-- invitations sent from the Telegram bot.
ALTER TABLE sessions ADD COLUMN phone TEXT;
--> statement-breakpoint
ALTER TABLE sessions ADD COLUMN name TEXT;
--> statement-breakpoint
ALTER TABLE sessions ADD COLUMN verified_at INTEGER;
--> statement-breakpoint
-- One pending code per session; only a hash of the code is stored.
CREATE TABLE otps(session_id TEXT PRIMARY KEY REFERENCES sessions(id),salon_id TEXT NOT NULL REFERENCES salons(id),phone TEXT NOT NULL,name TEXT NOT NULL,code_hash TEXT NOT NULL,tries INTEGER NOT NULL DEFAULT 0,sent_at INTEGER NOT NULL,expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX otp_phone ON otps(phone,sent_at);
--> statement-breakpoint
CREATE TABLE sms_log(id TEXT PRIMARY KEY,salon_id TEXT,kind TEXT NOT NULL,phone TEXT NOT NULL,provider_id TEXT,status TEXT NOT NULL,error TEXT,created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX sms_log_lookup ON sms_log(kind,phone,created_at);
