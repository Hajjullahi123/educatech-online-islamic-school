#!/bin/sh
set -e

echo "[EducaTech] Initializing database schema on persistent volume..."
npx prisma db push --accept-data-loss || true

echo "[EducaTech] Seeding master SaaS organization and default accounts..."
npx prisma db seed || true

echo "[EducaTech] Starting WebSocket real-time Quran sync server..."
node socket-server.js &

echo "[EducaTech] Launching standalone application server..."
exec node server.js
