# 🦅 Helldivers 2 Democracy Hub

A full-stack web application providing real-time information about the Helldivers 2 galactic war, built with ASP.NET Core 9.0 and Vue.js.

[![Deploy to Azure](https://github.com/DanJ210/Helldivers-2-Democracy-Hub/actions/workflows/azure-container-apps.yml/badge.svg)](https://github.com/DanJ210/Helldivers-2-Democracy-Hub/actions/workflows/azure-container-apps.yml)

## 🌐 Live Application

**Visit the app**: https://helldivers2-democracy-hub.happyglacier-18d7f734.eastus.azurecontainerapps.io

## 📋 Features

- **Real-time War Data** - Live updates from the Helldivers 2 API
- **Campaign Tracking** - Monitor ongoing galactic campaigns
- **Planet Information** - Detailed planet status and liberation progress
- **Responsive Design** - Works on desktop and mobile devices
- **Auto-scaling** - Hosted on Azure Container Apps with automatic scaling

## 🛠️ Technology Stack

### Backend
- **ASP.NET Core 9.0** - Modern web API framework
- **C#** - Primary backend language
- **Health Checks** - Built-in monitoring endpoints

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Responsive CSS** - Mobile-first design

### Infrastructure
- **Docker** - Containerized deployment
- **Azure Container Apps** - Serverless container hosting
- **Azure Container Registry** - Private container registry
- **GitHub Actions** - Automated CI/CD pipeline

## 🚀 Quick Start

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 20.x](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for containerization)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/DanJ210/Helldivers-2-Democracy-Hub.git
   cd Helldivers-2-Democracy-Hub
   ```

2. **Run with .NET CLI**
   ```bash
   cd HellDivers2DemocracyHub
   dotnet run
   ```

3. **Access the application**
   - Open http://localhost:5000 in your browser
   - The Vue.js frontend will be served alongside the API

### Docker Development

1. **Build and run with Docker**
   ```bash
   docker build -t helldivers2-democracy-hub .
   docker run -p 5000:5000 helldivers2-democracy-hub
   ```

2. **Access the application**
   - Open http://localhost:5000 in your browser

## 🏗️ Project Structure

```
Helldivers-2-Democracy-Hub/
├── 🌐 HellDivers2DemocracyHub/          # Main ASP.NET Core application
│   ├── Controllers/                     # API controllers
│   ├── Models/                         # Data models
│   ├── Services/                       # Business logic services
│   ├── ClientApp/                      # Vue.js frontend
│   │   ├── src/
│   │   │   ├── components/             # Vue components
│   │   │   ├── views/                  # Page components
│   │   │   ├── services/               # API services
│   │   │   └── types/                  # TypeScript definitions
│   │   └── package.json                # Node.js dependencies
│   └── Program.cs                      # Application entry point
├── 🐳 Dockerfile                       # Multi-stage container build
├── 🔄 .github/workflows/               # GitHub Actions CI/CD
└── 📁 deployment/                      # Deployment scripts and docs
```

## 🔧 API Endpoints

- **`GET /api/helldivers2/war`** - Current war status
- **`GET /api/helldivers2/campaigns`** - Active campaigns
- **`GET /health`** - Application health check

## 🚀 Deployment

The application is automatically deployed to Azure Container Apps using GitHub Actions when changes are pushed to the main branch.

### Manual Deployment

For manual deployment to Azure, see the deployment scripts in the `deployment/` folder:

- `deploy-container-apps-docker.ps1` - Deploy to Azure Container Apps
- `setup-github-secrets.ps1` - Configure CI/CD secrets

## 🔄 CI/CD Pipeline

The application uses GitHub Actions for continuous integration and deployment:

1. **Build** - Compile .NET application and build Vue.js frontend
2. **Test** - Run unit tests (when available)
3. **Containerize** - Build Docker image
4. **Deploy** - Push to Azure Container Registry and update Container App

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 About Helldivers 2

Helldivers 2 is a cooperative third-person shooter game where players fight for "managed democracy" across the galaxy. This application helps track the ongoing galactic war and liberation efforts.

## 🤝 Acknowledgments

- **Arrowhead Game Studios** - For creating Helldivers 2
- **Helldivers 2 API** - For providing real-time war data
- **Azure** - For hosting infrastructure
- **Vue.js & ASP.NET Core** - For the excellent frameworks

---

**For Super Earth! For Democracy!** 🦅

Made with ❤️ for the Helldivers community
