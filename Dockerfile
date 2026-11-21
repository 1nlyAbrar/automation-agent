FROM n8nio/n8n:latest

# Set memory limit to prevent out of memory error
ENV NODE_OPTIONS="--max-old-space-size=400"
ENV PORT=5678
EXPOSE 5678