#  Stage 1: Build Angular frontend 
FROM node:24-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

#  Stage 2: Install Python dependencies 
FROM python:3.12-slim AS py-builder
RUN mkdir /app
WORKDIR /app
COPY --exclude=frontend/ . /app/
RUN pip install -r requirements.txt

# Install nginx + envsubst (gettext-base)
RUN apt-get update && apt-get install -y --no-install-recommends nginx gettext-base && \
    rm -rf /var/lib/apt/lists/*

ENV PORT=5051
WORKDIR /app

# Ensure the data directory exists before declaring it as a VOLUME
RUN mkdir -p /data
VOLUME ["/data"]

# Copy built Angular SPA
COPY --from=frontend-builder /app/dist/frontend/browser /app/static_angular

# Install nginx site config
COPY nginx.conf /etc/nginx/sites-enabled/default
RUN rm -f /etc/nginx/sites-enabled/default.old 2>/dev/null; \
    nginx -t

# Expose nginx port
EXPOSE 80

ENTRYPOINT ["sh", "docker_init.sh"]