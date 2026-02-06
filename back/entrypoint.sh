#!/bin/bash

echo "Starting Laravel application..."

# Display PHP version for debugging
php --version

# Display Laravel version for debugging
php artisan --version

# Wait a moment to ensure the database is ready (optional but useful)
# Uncomment if you need to wait for database
# echo "Waiting for database to be ready..."
# while ! nc -z ${DB_HOST:-localhost} ${DB_PORT:-5432}; do
#   sleep 1
# done

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Check if migrations succeeded
if [ $? -eq 0 ]; then
    echo "Migrations completed successfully."
else
    echo "Migrations failed!" >&2
    exit 1
fi

# Run database seeders
echo "Running database seeders..."
php artisan db:seed --force

# Check if seeding succeeded
if [ $? -eq 0 ]; then
    echo "Seeding completed successfully."
else
    echo "Seeding failed!" >&2
    exit 1
fi

# Clear Laravel caches (optional but good practice)
echo "Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Start PHP-FPM
echo "Starting PHP-FPM..."
exec php-fpm
