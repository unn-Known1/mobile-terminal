#!/bin/bash

CLOUDFLARED="$HOME/.cloudflared/cloudflared"
# In development: Vite dev server runs on 5173 and proxies API to Express (5151).
# In production: Express serves frontend+backend on the same port (default 5151).
# Override by setting PORT environment variable.
SERVER_PORT=${PORT:-5173}

install_cloudflared() {
    echo "cloudflared not found. Installing..."
    mkdir -p "$HOME/.cloudflared"
    curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o "$CLOUDFLARED"
    chmod +x "$CLOUDFLARED"
}

if [ ! -f "$CLOUDFLARED" ]; then
    install_cloudflared
fi

# Use PORT env var if set, otherwise default to 3000
PORT=${PORT:-$SERVER_PORT}

echo "Starting tunnel to localhost:$PORT..."
"$CLOUDFLARED" tunnel --url "http://localhost:$PORT"