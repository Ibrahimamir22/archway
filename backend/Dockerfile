FROM python:3.11-slim

WORKDIR /app

# Install system dependencies and build tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install wheel first to enable building wheels
RUN pip install --upgrade pip && \
    pip install --no-cache-dir wheel setuptools

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project
COPY . .

# Create media and static directories
RUN mkdir -p /app/media /app/static

# Set environment variable to tell Django that it's okay to serve static files
ENV DJANGO_SETTINGS_MODULE=interior_platform.settings
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Start command
CMD python manage.py collectstatic --no-input && \
    python manage.py migrate && \
    python manage.py runserver 0.0.0.0:8000 