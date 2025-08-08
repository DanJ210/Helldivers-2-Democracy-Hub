using HellDivers2DemocracyHub.Models;
using System.Text.Json;

namespace HellDivers2DemocracyHub.Services
{
    public interface IHellDivers2Service
    {
        Task<WarStatus?> GetWarStatusAsync();
        Task<List<MajorOrder>> GetMajorOrdersAsync();
        Task<Statistics?> GetWarStatisticsAsync();
        Task<List<Planet>> GetPlanetsAsync();
        Task<List<Campaign>> GetCampaignsAsync();
        Task<List<Dispatch>> GetDispatchesAsync();
        Task<List<SteamNews>> GetSteamNewsAsync();
        Task<List<SpaceStation>> GetSpaceStationsAsync();
    }

    public class HellDivers2Service : IHellDivers2Service
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<HellDivers2Service> _logger;

        // Helldivers 2 Community API endpoints
        private const string BaseUrl = "https://api.helldivers2.dev";
        private const string WarStatusEndpoint = "/api/v1/war";
        private const string MajorOrdersEndpoint = "/api/v1/assignments";
        private const string PlanetsEndpoint = "/api/v1/planets";
        private const string CampaignsEndpoint = "/api/v1/campaigns";
        private const string DispatchesEndpoint = "/api/v1/dispatches";
        private const string SteamNewsEndpoint = "/api/v1/steam";
        private const string SpaceStationsEndpoint = "/api/v2/space-stations";

        public HellDivers2Service(HttpClient httpClient, ILogger<HellDivers2Service> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _httpClient.BaseAddress = new Uri(BaseUrl);
            
            // Add required headers as per API documentation
            _httpClient.DefaultRequestHeaders.Add("X-Super-Client", "Helldivers2DemocracyHub");
            _httpClient.DefaultRequestHeaders.Add("X-Super-Contact", "github.com/DanJ210/helldivers-2-democracy-hub");
        }

        public async Task<WarStatus?> GetWarStatusAsync()
        {
            try
            {
                _logger.LogInformation("Fetching war status from Helldivers 2 API");
                var response = await _httpClient.GetStringAsync(WarStatusEndpoint);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                return JsonSerializer.Deserialize<WarStatus>(response, options);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error fetching war status from Helldivers 2 API");
                return null;
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing war status response");
                return null;
            }
        }

        public async Task<List<MajorOrder>> GetMajorOrdersAsync()
        {
            try
            {
                _logger.LogInformation("Fetching major orders from Helldivers 2 API");
                var response = await _httpClient.GetStringAsync(MajorOrdersEndpoint);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var majorOrders = JsonSerializer.Deserialize<List<MajorOrder>>(response, options);
                return majorOrders ?? new List<MajorOrder>();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error fetching major orders from Helldivers 2 API");
                return new List<MajorOrder>();
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing major orders response");
                return new List<MajorOrder>();
            }
        }

        public async Task<Statistics?> GetWarStatisticsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching war statistics from Helldivers 2 API");
                // Statistics are part of the war endpoint response
                var response = await _httpClient.GetStringAsync(WarStatusEndpoint);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var warStatus = JsonSerializer.Deserialize<WarStatus>(response, options);
                return warStatus?.Statistics;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error fetching war statistics from Helldivers 2 API");
                return null;
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing war statistics response");
                return null;
            }
        }

        public async Task<List<Planet>> GetPlanetsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching planets from Helldivers 2 API");
                var response = await _httpClient.GetStringAsync(PlanetsEndpoint);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var planets = JsonSerializer.Deserialize<List<Planet>>(response, options);
                return planets ?? new List<Planet>();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error fetching planets from Helldivers 2 API");
                return new List<Planet>();
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing planets response");
                return new List<Planet>();
            }
        }

        public async Task<List<Campaign>> GetCampaignsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching campaigns from Helldivers 2 API");
                var response = await _httpClient.GetStringAsync(CampaignsEndpoint);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var campaigns = JsonSerializer.Deserialize<List<Campaign>>(response, options);
                return campaigns ?? new List<Campaign>();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error fetching campaigns from Helldivers 2 API");
                return new List<Campaign>();
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing campaigns response");
                return new List<Campaign>();
            }
        }

        public async Task<List<Dispatch>> GetDispatchesAsync()
        {
            try
            {
                _logger.LogInformation("Fetching dispatches from Helldivers 2 API");
                var response = await _httpClient.GetStringAsync(DispatchesEndpoint);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var dispatches = JsonSerializer.Deserialize<List<Dispatch>>(response, options);
                return dispatches ?? new List<Dispatch>();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error fetching dispatches from Helldivers 2 API");
                return new List<Dispatch>();
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing dispatches response");
                return new List<Dispatch>();
            }
        }

        public async Task<List<SteamNews>> GetSteamNewsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching Steam news from Helldivers 2 API");
                var response = await _httpClient.GetStringAsync(SteamNewsEndpoint);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var steamNews = JsonSerializer.Deserialize<List<SteamNews>>(response, options);
                return steamNews ?? new List<SteamNews>();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error fetching Steam news from Helldivers 2 API");
                return new List<SteamNews>();
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing Steam news response");
                return new List<SteamNews>();
            }
        }

        public async Task<List<SpaceStation>> GetSpaceStationsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching space stations from Helldivers 2 API");
                var response = await _httpClient.GetStringAsync(SpaceStationsEndpoint);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var spaceStations = JsonSerializer.Deserialize<List<SpaceStation>>(response, options);
                return spaceStations ?? new List<SpaceStation>();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error fetching space stations from Helldivers 2 API");
                return new List<SpaceStation>();
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing space stations response");
                return new List<SpaceStation>();
            }
        }
    }
}
