#!/bin/bash
# Rebuild the landing and re-fetch every page for the audit.
# Deliberately does NOT restart the server: the tracked preview process owns port 4173.
# (Restart it with the process tool, or this script used to leave an untracked orphan.)
set -e
cd /home/user/ayneh-hair-studio
(cd design/landing && python build.py >/dev/null)
mkdir -p /tmp/pages
for p in home:"/" hair:"/hair" color:"/color" nails:"/nails" lashes:"/lashes" salon:"/salon-panel" sample:"/sample" try:"/try" sdemo:"/s/demo"; do
  n=${p%%:*}; u=${p#*:}
  curl -s "http://127.0.0.1:4173$u" -o /tmp/pages/$n.html
done
echo "rebuilt + refetched (server untouched)"
