# Mobile Terminal - Cloudflare Deployment

## Quick One-Line Deployment

Access your terminal from any browser with just one command:

```bash
curl -sL https://f79rtjqmxcir.space.minimax.io/deploy.sh | bash
```

Or clone and run manually:

```bash
git clone https://github.com/unn-Known1/mobile-terminal.git
cd mobile-terminal
chmod +x quick-deploy.sh
./quick-deploy.sh
```

## What You Get

- **Cloudflare URL** - Access from anywhere via HTTPS
- **PIN Protection** - Secure access with auto-generated PIN
- **Multi-Tab Terminal** - Open multiple terminal sessions
- **Real PTY Emulation** - Full bash/zsh/sh support
- **Browser-Based** - Works in any modern browser

## Features

| Feature | Description |
|---------|-------------|
| Multi-Tab | Click + to add new terminal tabs |
| Split View | Split terminal horizontally or vertically |
| Themes | 10+ color themes |
| Mobile Optimized | On-screen keyboard toolbar |
| PWA Installable | Add to home screen |
| File Explorer | Browse and manage files |

## Access Instructions

1. Run the deployment script
2. Open the generated URL in your browser
3. Enter the displayed PIN
4. Start running commands!

## One-Line Curl Access

Once deployed, you can curl commands directly:

```bash
# Direct terminal command execution
curl -X POST https://YOUR-URL/api/terminal/exec \
  -H "Content-Type: application/json" \
  -d '{"command": "ls -la"}'
```

## Architecture

- **Frontend**: React + xterm.js (deployed on Cloudflare Pages)
- **Backend**: Express + Socket.io + node-pty
- **Tunnel**: Cloudflare Argo Tunnel for public access

## License

MIT License
