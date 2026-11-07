-- Self-serve pages built in a specialist edition's bot (editions only; worker/onboarding.js).
-- onboarding: one unfinished wizard per bot chat ("telegram:<chat>"), dropped after 24 idle hours.
-- trials.maker: the bot user ("telegram:<user id>") who built the page; one page per user.
-- trials.spent_alert: the "free images finished" messages went out once.
CREATE TABLE onboarding(key TEXT PRIMARY KEY,data TEXT NOT NULL,updated_at INTEGER NOT NULL);
--> statement-breakpoint
ALTER TABLE trials ADD COLUMN maker TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
CREATE UNIQUE INDEX trials_maker ON trials(maker) WHERE maker<>'';
--> statement-breakpoint
ALTER TABLE trials ADD COLUMN spent_alert INTEGER NOT NULL DEFAULT 0;
