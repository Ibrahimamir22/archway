# Stage 1: Base image with system dependencies and Python setup
FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies needed for python packages (like psycopg2)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Create a non-root user for security
RUN addgroup --system app && adduser --system --group app

# --------------------------------------------------------------------

# Stage 2: Builder stage - install dependencies (including dev)
# This helps cache dependencies unless requirements change
FROM base AS builder

# Install build tools if needed
RUN pip install --no-cache-dir wheel setuptools

# Copy only requirements first to leverage Docker cache
COPY requirements.txt requirements-dev.txt ./
# Install all dependencies (including dev)
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements-dev.txt && \
    pip install --no-cache-dir -r requirements-dev.txt

# --------------------------------------------------------------------

# Stage 3: Development stage (default if no target specified)
FROM base AS development

# Copy installed wheels from builder stage (optional but can speed up)
COPY --from=builder /app/wheels /wheels
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Install all dependencies (might be faster using copied site-packages/wheels)
# If the above COPY works reliably, this might not be strictly necessary
# RUN pip install --no-cache -r requirements-dev.txt

# Copy entrypoint/wait script if you have one
# COPY ./docker/entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh

# Switch to non-root user
USER app

# Default command for development (runserver)
# Migrations and wait-for-db are handled in docker-compose.yml command for dev
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# --------------------------------------------------------------------

# Stage 4: Production stage
FROM base AS production
WORKDIR /app

# Copy pre-built wheels from builder stage
COPY --from=builder /app/wheels /wheels

# Copy requirements file
COPY requirements.txt .

# Install production dependencies from wheels and requirements file
RUN pip install --no-cache-dir /wheels/* && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables for production build
ENV DJANGO_SETTINGS_MODULE=interior_platform.settings.production
ENV DEBUG=False

# Set static and media file locations
ENV STATIC_ROOT /app/staticfiles
ENV MEDIA_ROOT /app/mediafiles
RUN mkdir -p $STATIC_ROOT $MEDIA_ROOT

# Collect static files using production settings
RUN python manage.py collectstatic --noinput

# Chown directories to the non-root user
RUN chown -R app:app $STATIC_ROOT $MEDIA_ROOT /app

# Switch to non-root user
USER app

# Expose port 8000
EXPOSE 8000

# Command to run the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "interior_platform.wsgi:application"] 