FROM n8nio/n8n:latest

# Render uses port 10000 by default, but we'll set it to 5678 for n8n
ENV PORT=5678
EXPOSE 5678