#!/bin/bash

# Run migrations
php artisan migrate --force

# Run seeders
php artisan db:seed --force

# Start PHP-FPM
exec php-fpm
