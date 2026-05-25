#!/bin/sh
set -e

mkdir -p /data

npx prisma db push

exec node dist/main.js
