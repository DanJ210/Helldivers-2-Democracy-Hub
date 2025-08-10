# Helldivers 2 Democracy Hub

A .NET 9 web application with Vue.js frontend that displays real-time data from the Helldivers 2 game universe.

## Features

- **Real-time War Status**: Track the current galactic war progress
- **Major Orders**: View active assignments from Super Earth High Command  
- **War Statistics**: Monitor mission success rates, enemy kills, and active Helldiver count
- **Galaxy Overview**: Check planet liberation status and battles
- **Auto-refresh**: Data automatically updates every 5 minutes

## Technology Stack

### Backend (.NET 9)
- ASP.NET Core Web API
- HttpClient for external API calls
- Dependency injection
- CORS support for development

### Frontend (Vue.js 3)
- TypeScript support
- Vue Router for SPA navigation
- Pinia for state management
- Vite for fast development and building
- Responsive design with CSS Grid

## API Integration

This application integrates with the Helldivers 2 Community API to fetch:
- Current war status and statistics
- Active major orders (assignments)
- Planet liberation data
- Player statistics

## Getting Started

### Prerequisites
- .NET 9 SDK
- Node.js (version 18.16.0 or higher)
- npm or yarn

### Running the Application

1. **Start the backend API:**
   ```powershell
   cd "E:\source\repos\Helldivers 2 Democracy Hub\HellDivers2DemocracyHub"
   dotnet run
   ```

2. **Start the Vue.js frontend:**
   ```powershell
   cd "E:\source\repos\Helldivers 2 Democracy Hub\HellDivers2DemocracyHub\ClientApp"
   npm run serve
   ```

3. **Access the application:**
   - Frontend: https://localhost:44466
   - Backend API: https://localhost:7178

### Development

The application is configured for development with:
- Hot reload for Vue.js components
- CORS enabled for local development
- API proxy configuration in Vite

## API Endpoints

- `GET /api/helldivers2/dashboard` - Complete dashboard data
- `GET /api/helldivers2/war-status` - Current war status
- `GET /api/helldivers2/major-orders` - Active major orders
- `GET /api/helldivers2/statistics` - War statistics
- `GET /api/helldivers2/planets` - Planet data

## For Super Earth! For Democracy!

*Managed Democracy is the only way forward for humanity.*
