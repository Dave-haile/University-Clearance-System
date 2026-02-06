#!/bin/sh

php artisan migrate:fresh --force
php artisan db:seed --force
php artisan serve --host=0.0.0.0 --port=10000
