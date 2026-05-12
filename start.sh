#!/bin/sh
set -e

echo "🔧 Running prisma db push..."
# Retry prisma db push up to 3 times
for i in 1 2 3; do
  if node_modules/.bin/prisma db push --accept-data-loss; then
    echo "✅ prisma db push succeeded"
    break
  else
    echo "⚠️  prisma db push attempt $i failed, retrying in 5s..."
    if [ $i -eq 3 ]; then
      echo "❌ prisma db push failed after 3 attempts, starting server anyway..."
    fi
    sleep 5
  fi
done

echo "🚀 Starting Next.js..."
exec node_modules/.bin/next start
