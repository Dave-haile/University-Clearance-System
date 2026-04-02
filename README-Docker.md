# 🐳 Docker Deployment Guide

This guide explains how to deploy the University Clearance Management System using Docker containers.

---

## 🚀 Quick Start

### Production Deployment

```bash
# Clone and navigate to the project
git clone https://github.com/Dave-haile/University-Clearance-System.git
cd University-Clearance-System

# Build and start all services
docker compose up -d

# View running containers
docker compose ps

# View logs
docker compose logs -f
```

### Development Deployment

```bash
# Use development configuration
docker compose -f docker-compose.dev.yml up -d

# Access services:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# Database: localhost:5432
# Redis: localhost:6379
```

---

## 📋 Services Overview

### Production Services

| Service      | Port | Description               |
| ------------ | ---- | ------------------------- |
| **Frontend** | 3000 | React application (Nginx) |
| **Backend**  | 8000 | Laravel API               |
| **Nginx**    | 80   | Web server for Laravel    |
| **Database** | 5432 | PostgreSQL database       |

### Development Services

| Service      | Port | Description                |
| ------------ | ---- | -------------------------- |
| **Frontend** | 5173 | Vite dev server            |
| **Backend**  | 8000 | Laravel development server |
| **Database** | 5432 | PostgreSQL database        |
| **Redis**    | 6379 | Cache and sessions         |

---

## 🔧 Configuration

### Environment Variables

The Docker setup automatically configures environment variables. Key variables include:

- `DB_HOST=db` (PostgreSQL container)
- `DB_DATABASE=clearance_db`
- `DB_USERNAME=clearance_user`
- `DB_PASSWORD=clearance_pass`
- `VITE_API_BASE_URL=http://localhost:8000` (Frontend API URL)
- `APP_ENV=production` (or `local` for development)

### Database Credentials

Default database credentials (change in production):

- **Database**: `clearance_db`
- **Username**: `clearance_user`
- **Password**: `clearance_pass`

---

## 🛠️ Common Commands

### Building Images

```bash
# Build all services
docker compose build

# Build specific service
docker compose build backend

# Rebuild without cache
docker compose build --no-cache
```

### Managing Containers

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v

# Restart specific service
docker compose restart backend

# View logs
docker compose logs -f backend
```

### Database Operations

```bash
# Run migrations
docker compose exec backend php artisan migrate

# Seed database
docker compose exec backend php artisan db:seed

# Access database
docker compose exec db psql -U clearance_user -d clearance_db

# Create new migration
docker compose exec backend php artisan make:migration create_table
```

### Development Workflow

```bash
# Start development environment
docker compose -f docker-compose.dev.yml up -d

# Watch logs
docker compose -f docker-compose.dev.yml logs -f

# Execute commands in containers
docker compose -f docker-compose.dev.yml exec backend bash
docker compose -f docker-compose.dev.yml exec frontend sh
```

---

## 📁 File Structure

```
University-clearance-system/
├── back/
│   ├── Dockerfile          # Production backend
│   ├── Dockerfile.dev      # Development backend
│   └── .dockerignore       # Backend ignore rules
├── front/
│   ├── Dockerfile          # Production frontend
│   ├── Dockerfile.dev      # Development frontend
│   ├── nginx.conf          # Nginx configuration
│   └── .dockerignore       # Frontend ignore rules
├── nginx/
│   └── nginx.conf          # Laravel Nginx config
├── docker-compose.yml      # Production services
├── docker-compose.dev.yml  # Development services
├── .env.docker             # Docker environment template
└── README-Docker.md        # This file
```

---

## 🔍 Troubleshooting

### Common Issues and Solutions

1. **Database Connection Failed**
   
   **Problem**: Laravel can't connect to PostgreSQL
   **Solution**: Ensure environment variables are properly set in docker-compose.yml
   
   ```bash
   # Check database container
   docker compose ps db
   
   # Check database logs
   docker compose logs db
   
   # Test connection
   docker compose exec backend php artisan tinker
   >>> DB::connection()->getPdo()
   ```

2. **Frontend API Connection Issues**
   
   **Problem**: Frontend shows "undefined/api" or 405 errors
   **Solution**: Check VITE_API_BASE_URL environment variable
   
   ```bash
   # Verify environment variable is set
   docker compose exec frontend env | grep VITE_API_BASE_URL
   
   # Check vite proxy configuration
   # Ensure /api is proxied to http://localhost:8000
   ```

3. **Permission Issues**
   
   **Problem**: Storage directory permissions
   **Solution**: Fix Laravel storage permissions
   
   ```bash
   # Fix storage permissions
   docker compose exec backend chown -R www-data:www-data storage
   docker compose exec backend chmod -R 755 storage
   ```

4. **Node Version Compatibility**
   
   **Problem**: React Router requires Node 20+
   **Solution**: Ensure Dockerfile uses Node 20
   
   ```bash
   # Check Node version in container
   docker compose exec frontend node --version
   # Should show v20.x.x
   ```

5. **Package Installation Issues**
   
   **Problem**: npm ci fails due to lock file sync
   **Solution**: Use npm install instead of npm ci in Dockerfile
   
   ```bash
   # Rebuild frontend with npm install
   docker compose build --no-cache frontend
   ```

6. **Application Key Missing**
   
   **Problem**: "No application encryption key" error
   **Solution**: Ensure key generation in Dockerfile
   
   ```bash
   # Regenerate key
   docker compose exec backend php artisan key:generate
   docker compose exec backend php artisan config:cache
   ```

### Performance Optimization

```bash
# Limit resource usage
docker compose up -d --scale backend=2 --scale frontend=1

# Monitor resource usage
docker stats

# Clean up unused resources
docker system prune
```

---

## 🚀 Production Considerations

### Security

1. **Change Default Passwords**
   - Update database credentials in docker-compose.yml
   - Use strong passwords for production

2. **SSL/TLS Configuration**
   - Add SSL certificates to nginx
   - Update URLs to use HTTPS

3. **Network Security**
   - Use Docker networks for isolation
   - Limit exposed ports

### Monitoring

```bash
# Health checks
docker compose ps

# Resource monitoring
docker stats

# Log aggregation
docker compose logs --tail=100
```

### Backup Strategy

```bash
# Database backup
docker compose exec db pg_dump -U clearance_user clearance_db > backup.sql

# Volume backup
docker run --rm -v clearance_postgres_data:/data -v $(pwd):/backup ubuntu tar cvf /backup/postgres_backup.tar /data
```

---

## 📞 Support

If you encounter issues:

1. Check container logs: `docker compose logs -f`
2. Verify network connectivity: `docker network ls`
3. Test database connection: `docker compose exec backend php artisan tinker`
4. Check resource usage: `docker stats`

---

## 🔄 Updates

To update the application:

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker compose build
docker compose up -d

# Run migrations
docker compose exec backend php artisan migrate
```

---

## 🎯 Default Login Credentials

After successful deployment, you can access the application with:

**Admin Login**:
- URL: http://localhost:3000
- Username: `admin@university.com`
- Password: `adminpass`

---

## ✅ Deployment Verification Checklist

- [ ] All containers running: `docker compose ps`
- [ ] Database accessible: `docker compose exec db psql -U clearance_user -d clearance_db`
- [ ] Backend responding: `curl http://localhost:8000`
- [ ] Frontend loading: `curl http://localhost:3000`
- [ ] Login functionality working
- [ ] Database migrations applied
- [ ] No errors in container logs
