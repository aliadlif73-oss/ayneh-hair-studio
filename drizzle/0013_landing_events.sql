-- First-party, anonymous landing funnel telemetry. No cookies, no PII:
-- `session` is a random per-tab id held only in sessionStorage.
CREATE TABLE landing_events (
  id TEXT PRIMARY KEY,
  session TEXT NOT NULL,
  kind TEXT NOT NULL,
  step INTEGER,
  meta TEXT NOT NULL DEFAULT '',
  utm_source TEXT NOT NULL DEFAULT '',
  attribution TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX landing_events_time ON landing_events(created_at DESC);
--> statement-breakpoint
CREATE INDEX landing_events_kind ON landing_events(kind, created_at DESC);
--> statement-breakpoint
-- Campaign attribution travels with every lead, not just with events.
ALTER TABLE inquiries ADD COLUMN attribution TEXT NOT NULL DEFAULT '';
