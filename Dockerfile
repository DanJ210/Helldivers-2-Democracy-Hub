# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Copy project file and restore dependencies
COPY ["HellDivers2DemocracyHub/HellDivers2DemocracyHub.csproj", "HellDivers2DemocracyHub/"]
RUN dotnet restore "HellDivers2DemocracyHub/HellDivers2DemocracyHub.csproj"

# Copy all source code
COPY . .

# Build and publish the application
WORKDIR "/src/HellDivers2DemocracyHub"
RUN dotnet build "HellDivers2DemocracyHub.csproj" -c Release -o /app/build
RUN dotnet publish "HellDivers2DemocracyHub.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published application
COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000
ENV DOTNET_RUNNING_IN_CONTAINER=true

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run the application
ENTRYPOINT ["dotnet", "HellDivers2DemocracyHub.dll"]
