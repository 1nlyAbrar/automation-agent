FROM n8nio/n8n:latest

ENV PORT=10000
ENV N8N_PORT=10000
ENV N8N_PROTOCOL=https
ENV N8N_HOST=my-n8n-app-4mu2.onrender.com
ENV N8N_EDITOR_BASE_URL=https://my-n8n-app-4mu2.onrender.com
ENV WEBHOOK_URL=https://my-n8n-app-4mu2.onrender.com
ENV N8N_PATH="/"
ENV N8N_PROXY_HOPS=1
ENV NODE_OPTIONS="--max-old-space-size=400"

EXPOSE 10000