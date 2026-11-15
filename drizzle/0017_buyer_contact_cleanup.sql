-- One-time cleanup (owner's decision): salons the checkout made before the fix had the buyer's
-- own mobile and full name copied onto their public page (profile.phone, profile.manager).
-- Remove each only where it still equals exactly what provisioning copied; a phone or name the
-- salon wrote itself in «صفحهٔ من» is kept. The buyer's details stay on the order for /admin.
UPDATE salons SET profile = json_remove(profile, '$.phone')
WHERE owner_id LIKE 'order:%' AND json_valid(profile) AND EXISTS (
  SELECT 1 FROM orders o WHERE 'order:' || o.id = salons.owner_id
    AND json_extract(salons.profile, '$.phone') = '0' || substr(o.phone, 4));
--> statement-breakpoint
UPDATE salons SET profile = json_remove(profile, '$.manager')
WHERE owner_id LIKE 'order:%' AND json_valid(profile) AND EXISTS (
  SELECT 1 FROM orders o WHERE 'order:' || o.id = salons.owner_id
    AND json_extract(salons.profile, '$.manager') = o.contact_name);
