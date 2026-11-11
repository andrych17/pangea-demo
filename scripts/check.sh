#!/usr/bin/env bash
# Pre-deploy check. Run before every Vercel deploy: npm run check
# typecheck → lint → unit tests → production build in UTC (like Vercel) → next start → browser smoke test.
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${PORT:-3299}"

# next build in a folder where next dev is running corrupts the dev server (blank pages, HMR socket errors).
if pgrep -af "next dev" | grep -q "$PWD"; then
  echo "Stop 'next dev' in this folder first, then run the check again." >&2
  exit 1
fi

echo "› typecheck" && npm run -s typecheck
echo "› lint" && npm run -s lint
echo "› unit tests" && npm test --silent
echo "› build (TZ=UTC, same as Vercel)" && TZ=UTC npx next build

echo "› next start on :$PORT"
TZ=UTC setsid npx next start -p "$PORT" >/tmp/demo-starter-start.log 2>&1 &
SERVER=$!
trap 'kill -- -"$SERVER" 2>/dev/null || true' EXIT
for _ in $(seq 1 60); do
  curl -sf -o /dev/null "http://127.0.0.1:$PORT/" && break
  sleep 0.5
done

echo "› smoke test (browser in Asia/Jakarta, server in UTC)"
python3 scripts/smoke.py "http://127.0.0.1:$PORT"
