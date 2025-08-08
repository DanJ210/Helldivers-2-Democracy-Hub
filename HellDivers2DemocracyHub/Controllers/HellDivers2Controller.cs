using Microsoft.AspNetCore.Mvc;
using HellDivers2DemocracyHub.Services;
using HellDivers2DemocracyHub.Models;

namespace HellDivers2DemocracyHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HellDivers2Controller : ControllerBase
    {
        private readonly IHellDivers2Service _hellDivers2Service;
        private readonly ILogger<HellDivers2Controller> _logger;

        public HellDivers2Controller(IHellDivers2Service hellDivers2Service, ILogger<HellDivers2Controller> logger)
        {
            _hellDivers2Service = hellDivers2Service;
            _logger = logger;
        }

        /// <summary>
        /// Get the current war status including overall progress and statistics
        /// </summary>
        [HttpGet("war-status")]
        public async Task<ActionResult<WarStatus>> GetWarStatus()
        {
            _logger.LogInformation("API: Getting war status");
            
            var warStatus = await _hellDivers2Service.GetWarStatusAsync();
            
            if (warStatus == null)
            {
                return StatusCode(503, "Unable to fetch war status from Helldivers 2 API");
            }

            return Ok(warStatus);
        }

        /// <summary>
        /// Get current major orders (assignments from Super Earth High Command)
        /// </summary>
        [HttpGet("major-orders")]
        public async Task<ActionResult<List<MajorOrder>>> GetMajorOrders()
        {
            _logger.LogInformation("API: Getting major orders");
            
            var majorOrders = await _hellDivers2Service.GetMajorOrdersAsync();
            return Ok(majorOrders);
        }

        /// <summary>
        /// Get overall war statistics
        /// </summary>
        [HttpGet("statistics")]
        public async Task<ActionResult<Statistics>> GetWarStatistics()
        {
            _logger.LogInformation("API: Getting war statistics");
            
            var statistics = await _hellDivers2Service.GetWarStatisticsAsync();
            
            if (statistics == null)
            {
                return StatusCode(503, "Unable to fetch war statistics from Helldivers 2 API");
            }

            return Ok(statistics);
        }

        /// <summary>
        /// Get information about all planets in the galaxy
        /// </summary>
        [HttpGet("planets")]
        public async Task<ActionResult<List<Planet>>> GetPlanets()
        {
            _logger.LogInformation("API: Getting planets");
            
            var planets = await _hellDivers2Service.GetPlanetsAsync();
            return Ok(planets);
        }

        /// <summary>
        /// Get comprehensive democracy hub data including war status, major orders, and statistics
        /// </summary>
        [HttpGet("dashboard")]
        public async Task<ActionResult<object>> GetDashboard()
        {
            _logger.LogInformation("API: Getting dashboard data");

            var warStatusTask = _hellDivers2Service.GetWarStatusAsync();
            var majorOrdersTask = _hellDivers2Service.GetMajorOrdersAsync();
            var statisticsTask = _hellDivers2Service.GetWarStatisticsAsync();
            var planetsTask = _hellDivers2Service.GetPlanetsAsync();

            await Task.WhenAll(warStatusTask, majorOrdersTask, statisticsTask, planetsTask);

            var dashboard = new
            {
                WarStatus = await warStatusTask,
                MajorOrders = await majorOrdersTask,
                Statistics = await statisticsTask,
                Planets = await planetsTask,
                LastUpdated = DateTime.UtcNow
            };

            return Ok(dashboard);
        }
    }
}
