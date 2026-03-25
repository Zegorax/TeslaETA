#!/bin/bash
set -ex

# Substitute environment variables in the compiled Angular JS bundle.
envsubst  < static_angular/assets/env.template.js > "static_angular/assets/env.js"

# Run Alembic database migrations
flask db upgrade

# Start nginx in the background
nginx

# Start Flask API server in the foreground (nginx proxies /api/ and /ws/ to it)
python -m app run --host=0.0.0.0 --port="${PORT:-5051}"