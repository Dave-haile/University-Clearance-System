# ================================
# Laravel Backend Dockerfile (Production-Ready)
# ================================

# Use official PHP 8.2 FPM image
FROM php:8.2-fpm

# -------------------
# Install system dependencies
# -------------------
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    zip \
    curl \
    && docker-php-ext-install pdo pdo_pgsql zip

# -------------------
# Install Composer globally
# -------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# -------------------
# Set working directory
# -------------------
WORKDIR /var/www

# -------------------
# Copy Laravel app files
# -------------------
COPY . .

# -------------------
# Install PHP dependencies
# -------------------
RUN composer install --optimize-autoloader

# -------------------
# Set folder permissions for Laravel
# -------------------
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# -------------------
# Run migrations automatically (force)
# -------------------
RUN php artisan migrate --force


# -------------------
# Cache config and routes (optional but recommended)
# -------------------
RUN php artisan config:cache
RUN php artisan route:cache

# -------------------
# Expose port 10000 (Render listens on this port)
# -------------------
EXPOSE 10000

# -------------------
# Start Laravel server
# -------------------
CMD php artisan migrate --force --seed && php artisan serve --host=0.0.0.0 --port=10000
