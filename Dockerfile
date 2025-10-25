FROM python:3.11-slim

# Install websockify and redis support
RUN pip install --no-cache-dir \
    websockify \
    redis \
    jwcrypto

# Install noVNC
RUN apt-get update && \
    apt-get install -y git && \
    git clone https://github.com/novnc/noVNC.git /usr/share/novnc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Expose ports
EXPOSE 6080 443

# Default command
CMD ["websockify", \
     "--web", "/usr/share/novnc", \
     "--token-plugin", "TokenRedis", \
     "--token-source", "redis:6379", \
     "0.0.0.0:6080"]
