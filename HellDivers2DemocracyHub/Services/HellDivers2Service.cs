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
    }

    public class HellDivers2Service : IHellDivers2Service
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<HellDivers2Service> _logger;

        // Helldivers 2 Community API endpoints
        private const string BaseUrl = "https://api.helldivers2.dev";
        private const string WarStatusEndpoint = "/api/v1/war";
        private const string MajorOrdersEndpoint = "/api/v1/assignments";
        private const string StatisticsEndpoint = "/api/v1/war/statistics";
        private const string PlanetsEndpoint = "/api/v1/war/planets";

        public HellDivers2Service(HttpClient httpClient, ILogger<HellDivers2Service> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _httpClient.BaseAddress = new Uri(BaseUrl);
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
                var response = await _httpClient.GetStringAsync(StatisticsEndpoint);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                return JsonSerializer.Deserialize<Statistics>(response, options);
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
    }
}
