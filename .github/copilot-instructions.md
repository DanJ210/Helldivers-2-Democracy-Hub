# Helldivers 2 Democracy Hub - GitHub Copilot Instructions

## Application Overview

This is a full-stack web application providing real-time information about the Helldivers 2 galactic war. The application fetches data from the Helldivers 2 Community API and displays it through a modern web interface.

**Live Application**: https://helldivers2-democracy-hub.happyglacier-18d7f734.eastus.azurecontainerapps.io

## Architecture & Technology Stack

### Backend
- **Framework**: ASP.NET Core 9.0 with C#
- **Pattern**: MVC with Web API controllers
- **API Integration**: Helldivers 2 Community API (https://api.helldivers2.dev)
- **Health Checks**: Built-in monitoring endpoints
- **Logging**: ILogger with structured logging
- **DI Container**: Built-in ASP.NET Core dependency injection

### Frontend
- **Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript with strict type checking
- **Build Tool**: Vite for fast development and building
- **State Management**: Pinia stores
- **Routing**: Vue Router 4
- **Styling**: CSS with responsive design patterns

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Hosting**: Azure Container Apps with auto-scaling
- **CI/CD**: GitHub Actions workflows
- **Registry**: Azure Container Registry

## Project Structure

```
HellDivers2DemocracyHub/               # .NET Core backend
├── Controllers/HellDivers2Controller.cs   # API endpoints
├── Services/HellDivers2Service.cs         # External API service
├── Models/WarModels.cs                    # Data transfer objects
├── Program.cs                             # Application startup
└── ClientApp/                             # Vue.js frontend
    ├── src/
    │   ├── components/                    # Vue components
    │   ├── services/helldivers2Api.ts     # API service layer
    │   ├── services/cacheService.ts       # Client-side caching
    │   ├── types/helldivers2.ts          # TypeScript type definitions
    │   ├── stores/                       # Pinia state management
    │   └── views/                        # Vue route components
    └── package.json                      # Node.js dependencies
```

## Coding Standards & Patterns

### Backend (.NET Core)
- **Async/Await**: All I/O operations use async/await pattern
- **Dependency Injection**: Use constructor injection for services
- **Error Handling**: Try-catch blocks with proper logging
- **API Documentation**: XML comments for all public endpoints
- **HTTP Client**: Single HttpClient instance with proper configuration
- **Logging**: Use ILogger with LogInformation, LogError, LogWarning
- **Status Codes**: Return appropriate HTTP status codes (200, 404, 503, etc.)

### Frontend (Vue.js + TypeScript)
- **Composition API**: Prefer Composition API over Options API
- **TypeScript**: Use strict typing with proper interfaces
- **Async Operations**: Handle API calls with proper error handling
- **Caching**: Implement client-side caching for API responses
- **Reactive Data**: Use Vue's reactivity system appropriately
- **Component Structure**: Single File Components (.vue files)

### API Integration
- **Base URL**: https://api.helldivers2.dev
- **Required Headers**:
  - `X-Super-Client: Helldivers2DemocracyHub`
  - `X-Super-Contact: github.com/DanJ210/helldivers-2-democracy-hub`
- **Rate Limiting**: Implement caching to respect API limits
- **Error Handling**: Handle API failures gracefully

## Key API Endpoints

### Backend API Routes (Controllers)
- `GET /api/helldivers2/war-status` - Current war status
- `GET /api/helldivers2/major-orders` - Active major orders
- `GET /api/helldivers2/statistics` - War statistics
- `GET /api/helldivers2/planets` - Planet information
- `GET /api/helldivers2/campaigns` - Active campaigns
- `GET /api/helldivers2/dispatches` - News dispatches
- `GET /api/helldivers2/steam-news` - Steam news articles
- `GET /api/helldivers2/space-stations` - Space station data

### External API Endpoints (Helldivers 2 Community API)
- `/api/v1/war` - War status and overall progress
- `/api/v1/assignments` - Major orders from Super Earth High Command
- `/api/v1/planets` - Planet data and liberation status
- `/api/v1/campaigns` - Active planetary campaigns
- `/api/v1/dispatches` - Official news dispatches
- `/api/v1/steam` - Steam news integration
- `/api/v2/space-stations` - Space station information

## Data Models

### Key Types/Interfaces
- `WarStatus` - Overall war progress and statistics
- `MajorOrder` - High-priority assignments from Super Earth
- `Planet` - Individual planet data and status
- `Campaign` - Planetary liberation campaigns
- `Statistics` - Aggregate war statistics
- `Dispatch` - Official news and updates
- `SteamNews` - Steam platform news
- `SpaceStation` - Space station status

### Important Properties
- Liberation percentages (0-100)
- Player statistics and impacts
- Reward systems (medals, etc.)
- Time-based data (expiration dates, timestamps)
- Faction information (Automatons, Terminids, Illuminate)

## Development Guidelines

### When Adding New Features
1. **API First**: Design backend endpoints before frontend implementation
2. **Type Safety**: Define TypeScript interfaces that match C# models
3. **Error Handling**: Implement proper error boundaries and fallbacks
4. **Caching**: Consider caching strategy for new data endpoints
5. **Responsive**: Ensure mobile compatibility for new UI components
6. **Testing**: Test with Docker containers locally before deployment

### Performance Considerations
- **Caching**: Implement appropriate cache durations for different data types
  - Dashboard: 5 minutes
  - War Status: 10 minutes
  - Major Orders: 5 minutes
  - Statistics: 2 minutes
  - Planets: 15 minutes
  - Dispatches: 30 minutes
- **Bundle Size**: Keep client-side bundle optimized
- **API Calls**: Minimize unnecessary API requests
- **Docker**: Use multi-stage builds to reduce image size

### Deployment & Infrastructure
- **Docker**: Application runs in containerized environment
- **Port**: Exposed on port 5000 (internally) / 8080 (externally)
- **Health Checks**: `/health` endpoint for container health monitoring
- **Environment**: Production environment with proper security headers
- **Auto-scaling**: Designed to handle variable load patterns

## Common Tasks & Patterns

### Adding New API Endpoint
1. Add method to `IHellDivers2Service` interface
2. Implement in `HellDivers2Service` with proper error handling
3. Add controller action in `HellDivers2Controller`
4. Update TypeScript types in `helldivers2.ts`
5. Add frontend service method in `helldivers2Api.ts`
6. Implement caching strategy as needed

### UI Component Development
1. Create Vue SFC with proper TypeScript typing
2. Use Composition API with proper reactive data
3. Implement error handling and loading states
4. Ensure responsive design
5. Add to appropriate route or parent component

### Data Flow
1. External API → HellDivers2Service → Controller → Frontend API Service → Vue Components
2. All async operations with proper error handling
3. Client-side caching to reduce server load
4. Reactive updates when data changes

## Security & Best Practices
- **API Keys**: No API keys required for Helldivers 2 Community API
- **CORS**: Properly configured for production environment
- **Headers**: Required headers for API compliance
- **Input Validation**: Validate data at API boundaries
- **Error Messages**: Don't expose internal details in error responses
- **Health Checks**: Implement comprehensive health monitoring

## Testing Considerations
- **Local Development**: Use `start.ps1` for quick local testing
- **Docker Testing**: Build and test containers locally
- **API Integration**: Mock external API calls for unit tests
- **End-to-End**: Test complete data flow from API to UI
- **Performance**: Monitor API response times and caching effectiveness

## Game Context (Helldivers 2)
- **Setting**: Galactic war for democracy against alien threats
- **Factions**: Automatons (robots), Terminids (bugs), Illuminate (squid-like aliens)
- **Gameplay**: Cooperative top-down shooter with strategic elements
- **Community**: Player actions affect the overall galactic war state
- **Super Earth**: The democratic government players serve
- **Major Orders**: Time-limited objectives from Super Earth High Command
- **Liberation**: Planetary campaigns to free worlds from alien control
