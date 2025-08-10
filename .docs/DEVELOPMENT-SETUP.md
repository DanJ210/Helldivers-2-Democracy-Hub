# Development Setup Guide

Complete setup guide for developing the Helldivers 2 Democracy Hub application.

> 💡 **Quick Reference**: For common commands and URLs, see the [🚀 Developer Cheat Sheet](./DEVELOPER-CHEAT-SHEET.md)

## 🛠️ Prerequisites

### Required Software
- **.NET 9 SDK** - For backend development
- **Node.js** (v20.19.0 or >=22.12.0) - For frontend development  
- **Git** - Version control
- **VS Code** (recommended) - IDE with extensions

### Recommended VS Code Extensions
- **C# Dev Kit** - For .NET development
- **Vue - Official** - Vue.js support
- **Tailwind CSS IntelliSense** - CSS utility autocomplete
- **PostCSS Language Support** - CSS processing
- **Headwind** - Tailwind class sorting

## 🚀 Quick Start

### 1. Clone and Setup
```powershell
# Clone the repository
git clone https://github.com/DanJ210/Helldivers-2-Democracy-Hub.git
cd "Helldivers 2 Democracy Hub"

# Install frontend dependencies
cd "HellDivers2DemocracyHub\ClientApp"
npm install
cd ..\..\
```

### 2. Development Mode
```powershell
# Option A: Use the provided start script (recommended)
.\start.ps1

# Option B: Manual startup
# Terminal 1 - Backend API
cd "HellDivers2DemocracyHub"
dotnet run

# Terminal 2 - Frontend Dev Server  
cd "HellDivers2DemocracyHub\ClientApp"
npm run dev
```

### 3. Access the Application
- **Frontend**: https://localhost:44466
- **Backend API**: https://localhost:7178
- **Vue DevTools**: https://localhost:44466/__devtools__

## 🏗️ Project Structure

```
Helldivers 2 Democracy Hub/
├── .docs/                              # 📚 Documentation
├── .github/                            # GitHub configuration
├── .vscode/                            # VS Code settings
├── deployment/                         # 🚀 Deployment scripts
├── HellDivers2DemocracyHub/            # 🏢 .NET Backend
│   ├── Controllers/                    # API endpoints
│   ├── Services/                       # Business logic
│   ├── Models/                         # Data models
│   └── ClientApp/                      # 🎨 Vue.js Frontend
│       ├── src/
│       │   ├── components/             # Vue components
│       │   ├── services/               # API services
│       │   ├── types/                  # TypeScript types
│       │   ├── utils/                  # Utility functions
│       │   └── views/                  # Route components
│       └── package.json
├── docker-compose.yml                  # 🐳 Docker setup
├── Dockerfile                          # Container configuration
└── README.md                           # Main documentation
```

## 🎨 Styling System

The project uses **Tailwind CSS** for styling with a custom Helldivers 2 theme:

### Custom Classes
```css
.hd-card           /* Dark themed cards */
.hd-button-primary /* Super Earth blue buttons */
.hd-status-active  /* Success state styling */
.hd-glow          /* Sci-fi glow effects */
```

### Usage Example
```vue
<template>
  <div class="hd-card">
    <h2 class="hd-heading-2">Major Orders</h2>
    <button class="hd-button-primary hd-glow">
      For Democracy!
    </button>
  </div>
</template>
```

See [Tailwind Migration Guide](./TAILWIND-MIGRATION-GUIDE.md) for complete styling documentation.

## 🔌 API Integration

### External API
- **Base URL**: https://api.helldivers2.dev
- **Required Headers**:
  - `X-Super-Client: Helldivers2DemocracyHub`
  - `X-Super-Contact: github.com/DanJ210/helldivers-2-democracy-hub`

### Internal API Endpoints
```
GET /api/helldivers2/war-status      # War progress
GET /api/helldivers2/major-orders    # Active assignments
GET /api/helldivers2/statistics      # Player statistics
GET /api/helldivers2/planets         # Planet data
GET /api/helldivers2/campaigns       # Active campaigns
GET /api/helldivers2/dispatches      # News updates
```

## 🧪 Development Workflow

### Frontend Development
```powershell
cd "HellDivers2DemocracyHub\ClientApp"

# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Format code
npm run format
```

### Backend Development
```powershell
cd "HellDivers2DemocracyHub"

# Run in development mode
dotnet run

# Build the project
dotnet build

# Run tests (when available)
dotnet test
```

### Docker Development
```powershell
# Build and run with Docker Compose
docker-compose up -d --build

# Access the application
# - Application: http://localhost:5000
# - Health check: http://localhost:5000/health

# View logs
docker-compose logs -f helldivers2-democracy-hub

# Stop containers
docker-compose down
```

## 🐛 Common Issues & Solutions

> 💡 **Comprehensive Troubleshooting**: For detailed troubleshooting commands and emergency procedures, see the [🚀 Developer Cheat Sheet](./DEVELOPER-CHEAT-SHEET.md#-troubleshooting-guide)

### Node.js Version Issues
```powershell
# Check Node.js version
node --version

# Should be v20.19.0 or >=v22.12.0
# Update using Node Version Manager or download from nodejs.org
```

### Port Conflicts
```powershell
# If ports 44466 or 7178 are in use:
netstat -ano | findstr :44466
taskkill /PID <PID> /F
```

### CORS Issues
- Ensure backend is running on https://localhost:7178
- Check `Program.cs` CORS configuration
- Verify Vite proxy settings in `vite.config.ts`

### Tailwind CSS Not Working
```powershell
# Verify Tailwind installation
cd "HellDivers2DemocracyHub\ClientApp"
npm list tailwindcss @tailwindcss/vite

# Check vite.config.ts has tailwindcss() plugin
# Verify @import "tailwindcss"; in main.css
```

## 📝 Code Standards

### TypeScript
- Use strict typing with proper interfaces
- Prefer Composition API over Options API
- Handle async operations with proper error handling

### CSS
- Use Tailwind utilities over custom CSS
- Follow BEM naming for custom classes
- Keep scoped styles minimal

### C#
- Use async/await for I/O operations
- Implement proper error handling and logging
- Follow dependency injection patterns

## 🚀 Deployment

For production deployment to Azure Container Apps, see:
- [Deployment Scripts](../deployment/DEPLOYMENT-SCRIPTS.md)
- [Deployment Success](../deployment/DEPLOYMENT-SUCCESS.md)

## 🆘 Getting Help

1. Check this documentation
2. Review [GitHub Copilot Instructions](../.github/copilot-instructions.md)
3. Examine example components in `src/components/`
4. Look at the main [README.md](../README.md)

---

**For Super Earth! For Democracy!**

*Efficient development serves the cause of Managed Democracy.*
