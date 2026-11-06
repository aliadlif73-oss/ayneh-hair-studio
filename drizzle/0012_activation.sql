CREATE TABLE salon_activations (
  id TEXT PRIMARY KEY,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  draft TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX salon_activations_time ON salon_activations(created_at DESC);
--> statement-breakpoint
CREATE TABLE salon_activation_assets (
  activation_id TEXT NOT NULL REFERENCES salon_activations(id) ON DELETE CASCADE,
  slot TEXT NOT NULL,
  mime TEXT NOT NULL,
  bytes BLOB NOT NULL,
  PRIMARY KEY (activation_id, slot)
);
