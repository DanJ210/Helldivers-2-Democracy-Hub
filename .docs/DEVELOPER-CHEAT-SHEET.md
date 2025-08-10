# Helldivers 2 Democracy Hub - Developer Cheat Sheet

Quick reference guide for common development tasks and commands.

## 🚀 Quick Start Commands

### Development Mode
```powershell
# Start both backend and frontend
.\start.ps1

# Manual startup
cd "HellDivers2DemocracyHub"
dotnet run
# In another terminal:
cd "HellDivers2DemocracyHub\ClientApp"
npm run dev
```

### Docker Mode
```powershell
# Start application in Docker
docker-compose up -d --build

# Stop application
docker-compose down
```

## 🌐 Application URLs

| Environment | Application URL | API Health Check | Notes |
|-------------|-----------------|------------------|-------|
| **Development** | https://localhost:44466 | https://localhost:7178/health | Hot reload, debugging |
| **Docker Local** | http://localhost:5000 | http://localhost:5000/health | Production-like |
| **Azure Production** | https://helldivers2-democracy-hub.happyglacier-18d7f734.eastus.azurecontainerapps.io | /health | Live application |

## 🐳 Docker Commands

### Basic Operations
```powershell
# Build and start (detached mode)
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs (live feed)
docker-compose logs -f helldivers2-democracy-hub

# View recent logs
docker-compose logs --tail=50 helldivers2-democracy-hub

# Stop all services
docker-compose down

# Remove containers and networks
docker-compose down --volumes --remove-orphans
```

### Troubleshooting
```powershell
# Rebuild without cache
docker-compose build --no-cache

# Check container health
docker inspect helldivers2-democracy-hub --format='{{.State.Health.Status}}'

# Access container shell
docker exec -it helldivers2-democracy-hub /bin/bash

# Check port usage
netstat -ano | findstr :5000
```

## 💻 Development Commands

### Frontend (Vue.js + Vite)
```powershell
cd "HellDivers2DemocracyHub\ClientApp"

# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Format code
npm run format

# Preview production build
npm run preview
```

### Backend (.NET Core)
```powershell
cd "HellDivers2DemocracyHub"

# Run in development mode
dotnet run

# Build the project
dotnet build

# Build for release
dotnet build -c Release

# Publish for production
dotnet publish -c Release -o ./publish

# Run tests (when available)
dotnet test
```

## 🎨 Tailwind CSS Commands

### Development
```powershell
cd "HellDivers2DemocracyHub\ClientApp"

# Tailwind is automatically processed by Vite
# No separate build step required

# Watch for changes (included in npm run dev)
# Classes are generated automatically
```

### Custom Classes Reference
```css
/* Layout */
.hd-card                    /* Dark themed card */
.hd-card-header             /* Card header with border */
.hd-dashboard-grid          /* 3-column responsive grid */
.hd-dashboard-grid-wide     /* 2-column responsive grid */

/* Buttons */
.hd-button-primary          /* Blue Super Earth button */
.hd-button-secondary        /* Gray secondary button */
.hd-button-danger           /* Red danger button */

/* Status Indicators */
.hd-status-active           /* Green success state */
.hd-status-warning          /* Yellow warning state */
.hd-status-danger           /* Red danger state */
.hd-status-info             /* Blue info state */

/* Effects */
.hd-glow                    /* Blue glow effect */
.hd-glow-yellow             /* Yellow glow effect */
.hd-glow-red                /* Red glow effect */
.hd-glow-green              /* Green glow effect */

/* Typography */
.hd-heading-1               /* 4xl bold heading */
.hd-heading-2               /* 2xl semibold heading */
.hd-heading-3               /* xl medium heading */
.hd-text-body               /* Body text with contrast */
.hd-text-caption            /* Small caption text */

/* Animations */
.hd-pulse                   /* Pulsing animation */
.hd-fade-in                 /* Fade in animation */
```

## 🔧 Troubleshooting Guide

### Common Issues

#### Port Conflicts
```powershell
# Check what's using the port
netstat -ano | findstr :44466
netstat -ano | findstr :7178
netstat -ano | findstr :5000

# Kill process using port
taskkill /PID <PID> /F
```

#### Node.js Issues
```powershell
# Check Node.js version (should be v20.19.0+)
node --version
npm --version

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
cd "HellDivers2DemocracyHub\ClientApp"
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

#### Docker Issues
```powershell
# Clean Docker system
docker system prune -f

# Remove all containers and images
docker-compose down --rmi all --volumes --remove-orphans

# Restart Docker Desktop
# (Use Docker Desktop UI or restart service)

# Check Docker daemon
docker version
```

#### .NET Issues
```powershell
# Check .NET version (should be 9.0+)
dotnet --version

# Clean and rebuild
cd "HellDivers2DemocracyHub"
dotnet clean
dotnet build

# Clear NuGet cache
dotnet nuget locals all --clear
```

#### Tailwind CSS Issues
```powershell
# Verify Tailwind installation
cd "HellDivers2DemocracyHub\ClientApp"
npm list tailwindcss @tailwindcss/vite

# Check configuration
# Ensure vite.config.ts has tailwindcss() plugin
# Verify @import "tailwindcss"; in main.css
```

## 📁 Project Structure Reference

```
Helldivers 2 Democracy Hub/
├── 📁 .docs/                           # Documentation
├── 📁 .github/                         # GitHub config
├── 📁 .vscode/                         # VS Code settings
├── 📁 deployment/                      # Azure deployment
├── 📁 HellDivers2DemocracyHub/         # .NET Backend
│   ├── 📁 Controllers/                 # API endpoints
│   ├── 📁 Services/                    # Business logic
│   ├── 📁 Models/                      # Data models
│   └── 📁 ClientApp/                   # Vue.js Frontend
│       ├── 📁 src/
│       │   ├── 📁 components/          # Vue components
│       │   ├── 📁 services/            # API services
│       │   ├── 📁 types/               # TypeScript types
│       │   ├── 📁 utils/               # Utilities
│       │   └── 📁 views/               # Route components
│       ├── 📄 package.json             # Dependencies
│       ├── 📄 vite.config.ts           # Vite config
│       └── 📄 tailwind.config.js       # Tailwind config
├── 📄 docker-compose.yml               # Docker services
├── 📄 Dockerfile                       # Container config
├── 📄 README.md                        # Main documentation
└── 📄 start.ps1                        # Development script
```

## 🔌 API Endpoints Reference

### Internal API (Your Backend)
```
Base URL: https://localhost:7178 (dev) | http://localhost:5000 (docker)

GET /api/helldivers2/dashboard          # Complete dashboard data
GET /api/helldivers2/war-status         # Current war status
GET /api/helldivers2/major-orders       # Active major orders
GET /api/helldivers2/statistics         # War statistics
GET /api/helldivers2/planets            # Planet data
GET /api/helldivers2/campaigns          # Active campaigns
GET /api/helldivers2/dispatches         # News dispatches
GET /api/helldivers2/steam-news         # Steam news articles
GET /api/helldivers2/space-stations     # Space station data
GET /health                             # Health check
```

### External API (Helldivers 2 Community)
```
Base URL: https://api.helldivers2.dev
Required Headers:
  - X-Super-Client: Helldivers2DemocracyHub
  - X-Super-Contact: github.com/DanJ210/helldivers-2-democracy-hub

GET /api/v1/war                         # War status
GET /api/v1/assignments                 # Major orders
GET /api/v1/planets                     # Planet data
GET /api/v1/campaigns                   # Campaigns
GET /api/v1/dispatches                  # Dispatches
GET /api/v1/steam                       # Steam news
GET /api/v2/space-stations              # Space stations
```

## 🚀 Deployment Commands

### Azure Container Apps
```powershell
# Navigate to deployment folder
cd deployment

# Run deployment script (requires Azure CLI)
.\deploy-container-apps-docker.ps1
```

### Manual Docker Build
```powershell
# Build image
docker build -t helldivers2-democracy-hub .

# Run locally
docker run -p 5000:5000 helldivers2-democracy-hub

# Tag for registry
docker tag helldivers2-democracy-hub <registry>/helldivers2-democracy-hub:latest

# Push to registry
docker push <registry>/helldivers2-democracy-hub:latest
```

## 📝 Git Workflow

### Basic Commands
```powershell
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main
```

### Branch Workflow
```powershell
# Create and switch to feature branch
git checkout -b feature/new-feature

# Switch between branches
git checkout main
git checkout feature/new-feature

# Merge feature branch
git checkout main
git merge feature/new-feature

# Delete merged branch
git branch -d feature/new-feature
```

## 🆘 Emergency Commands

### Stop Everything
```powershell
# Stop all Docker containers
docker stop $(docker ps -q)

# Kill all Node.js processes
taskkill /IM "node.exe" /F

# Kill all .NET processes
taskkill /IM "dotnet.exe" /F
```

### Reset Environment
```powershell
# Reset Docker
docker system prune -af --volumes
docker-compose down --rmi all --volumes --remove-orphans

# Reset Node.js
cd "HellDivers2DemocracyHub\ClientApp"
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install

# Reset .NET
cd "HellDivers2DemocracyHub"
dotnet clean
dotnet restore
dotnet build
```

---

**For Super Earth! For Democracy!** 🦅

*Quick reference for efficient Helldiver development*
