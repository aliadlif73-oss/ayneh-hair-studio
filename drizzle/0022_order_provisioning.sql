-- Builder draft details and salted PBKDF2 panel password hash for post-purchase subdomain provisioning.
ALTER TABLE orders ADD COLUMN draft TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN pass_hash TEXT NOT NULL DEFAULT '';
