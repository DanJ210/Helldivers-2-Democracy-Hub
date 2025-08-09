using System.Text.Json.Serialization;

namespace HellDivers2DemocracyHub.Models
{
    /// <summary>
    /// Known reward types from the Helldivers 2 Community API
    /// </summary>
    public static class RewardTypes
    {
        /// <summary>
        /// Medals - the primary currency for unlocking Warbond items
        /// </summary>
        public const int Medals = 1;
        
        // Additional reward types can be added here as they are discovered
        // Examples might include: Super Credits, Warbond Unlocks, etc.
    }

    /// <summary>
    /// Known task types from Major Order assignments
    /// </summary>
    public static class TaskTypes
    {
        // Task type constants can be added here as they are discovered
        // Examples: Kill enemies, liberate planets, complete missions, etc.
        // These will need to be identified through API observation
    }

    // War endpoint response model (/api/v1/war)
    public class WarStatus
    {
        public DateTime Started { get; set; }
        public DateTime? Ended { get; set; }
        public DateTime Now { get; set; }
        public string ClientVersion { get; set; } = string.Empty;
        public List<string> Factions { get; set; } = new List<string>();
        public double ImpactMultiplier { get; set; }
        public Statistics Statistics { get; set; } = new Statistics();
    }

    // Planet model from /api/v1/planets endpoint
    public class Planet
    {
        public int Index { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Sector { get; set; } = string.Empty;
        public Biome? Biome { get; set; }
        public List<Hazard> Hazards { get; set; } = new List<Hazard>();
        public long Hash { get; set; }
        public Position? Position { get; set; }
        public List<int> Waypoints { get; set; } = new List<int>();
        public long MaxHealth { get; set; }
        public long Health { get; set; }
        public bool Disabled { get; set; }
        public string InitialOwner { get; set; } = string.Empty;
        public string CurrentOwner { get; set; } = string.Empty;
        public double RegenPerSecond { get; set; }
        public Event? Event { get; set; }
        public Statistics? Statistics { get; set; }
        public List<int> Attacking { get; set; } = new List<int>();
        public List<Region> Regions { get; set; } = new List<Region>();
    }

    public class Biome
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class Hazard
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class Position
    {
        public double X { get; set; }
        public double Y { get; set; }
    }

    public class Event
    {
        public int Id { get; set; }
        public int EventType { get; set; }
        public string Faction { get; set; } = string.Empty;
        public long Health { get; set; }
        public long MaxHealth { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int CampaignId { get; set; }
        public List<int> JointOperationIds { get; set; } = new List<int>();
    }

    public class Region
    {
        public int Id { get; set; }
        public ulong Hash { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public long? Health { get; set; }
        public ulong MaxHealth { get; set; }
        public string Size { get; set; } = string.Empty;
        public double? RegenPerSecond { get; set; }
        public double? AvailabilityFactor { get; set; }
        public bool IsAvailable { get; set; }
        public long Players { get; set; }
    }

    public class Statistics
    {
        public ulong MissionsWon { get; set; }
        public ulong MissionsLost { get; set; }
        public ulong MissionTime { get; set; }
        
        /// <summary>
        /// Total Terminid enemies eliminated. API uses "terminidKills" property name.
        /// </summary>
        [JsonPropertyName("terminidKills")]
        public ulong BugKills { get; set; }
        
        public ulong AutomatonKills { get; set; }
        public ulong IlluminateKills { get; set; }
        public ulong BulletsFired { get; set; }
        public ulong BulletsHit { get; set; }
        public ulong TimePlayed { get; set; }
        public ulong Deaths { get; set; }
        public ulong Revives { get; set; }
        public ulong Friendlies { get; set; }
        public ulong MissionSuccessRate { get; set; }
        
        /// <summary>
        /// Average accuracy percentage. API now uses correct "accuracy" spelling.
        /// </summary>
        [JsonPropertyName("accuracy")]
        public ulong Accuracy { get; set; }
        
        public ulong PlayerCount { get; set; }
    }

    /// <summary>
    /// Represents a Major Order (Assignment) from Super Earth to the Helldivers community.
    /// Maps to the Assignment2 schema from the Helldivers 2 Community API (/api/v1/assignments).
    /// Also known as 'Major Orders' in the game.
    /// </summary>
    public class MajorOrder
    {
        /// <summary>
        /// The unique identifier of this assignment.
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// Progress tracking for the assignment. Array of numbers representing completion progress.
        /// The meaning of these numbers varies by assignment type.
        /// </summary>
        public List<long> Progress { get; set; } = new List<long>();

        /// <summary>
        /// The title of the assignment. May contain localized text depending on API request headers.
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// A long form description of the assignment, usually contains context and story elements.
        /// May contain localized text depending on API request headers.
        /// </summary>
        public string Briefing { get; set; } = string.Empty;

        /// <summary>
        /// A very short summary of the assignment description.
        /// May contain localized text depending on API request headers.
        /// Can be null if no description is provided.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// A list of tasks that need to be completed for this assignment.
        /// Each task represents a specific objective or requirement.
        /// </summary>
        public List<Task2> Tasks { get; set; } = new List<Task2>();

        /// <summary>
        /// The primary reward for completing the assignment.
        /// Can be null if no single primary reward is defined.
        /// </summary>
        public Reward2? Reward { get; set; }

        /// <summary>
        /// A complete list of all rewards for completing the assignment.
        /// May include multiple types of rewards (medals, super credits, etc.).
        /// </summary>
        public List<Reward2> Rewards { get; set; } = new List<Reward2>();

        /// <summary>
        /// The date and time when the assignment will expire and no longer be available.
        /// </summary>
        public DateTime Expiration { get; set; }

        /// <summary>
        /// Flags regarding the assignment. These may control special behaviors or properties.
        /// The exact meaning varies by assignment.
        /// </summary>
        public int Flags { get; set; }
        
        // Legacy aliases for compatibility with older code
        public long Id32 => Id;
        public DateTime ExpiresIn => Expiration;
    }

    /// <summary>
    /// Represents a task within a Major Order assignment that needs to be completed.
    /// Maps to the Task2 schema from the Helldivers 2 Community API.
    /// </summary>
    public class Task2
    {
        /// <summary>
        /// The type of task this represents. Different types may have different objectives
        /// (e.g., kill enemies, liberate planets, complete missions, etc.).
        /// </summary>
        public int Type { get; set; }

        /// <summary>
        /// A list of numerical values related to task requirements or progress.
        /// The exact meaning varies by task type (e.g., target numbers, thresholds, etc.).
        /// </summary>
        public List<ulong> Values { get; set; } = new List<ulong>();

        /// <summary>
        /// A list of numerical identifiers that define what each value in the Values array represents.
        /// Used to interpret the meaning of each value based on task type.
        /// </summary>
        public List<ulong> ValueTypes { get; set; } = new List<ulong>();
    }

    /// <summary>
    /// Represents a reward for completing a Major Order assignment.
    /// Maps to the Reward2 schema from the Helldivers 2 Community API.
    /// </summary>
    public class Reward2
    {
        /// <summary>
        /// The type of reward being granted.
        /// Known types: 1 = Medals, others may include Super Credits, Warbonds, etc.
        /// </summary>
        public int Type { get; set; }

        /// <summary>
        /// The amount of the reward type that will be awarded upon completion.
        /// </summary>
        public ulong Amount { get; set; }
    }

    // Legacy models for compatibility (can be removed later)
    public class Setting
    {
        public int Type { get; set; }
        public string OverrideTitle { get; set; } = string.Empty;
        public string OverrideBrief { get; set; } = string.Empty;
        public string TaskDescription { get; set; } = string.Empty;
        public List<int> Reward { get; set; } = new List<int>();
        public List<int> Flags { get; set; } = new List<int>();
    }

    public class TaskDescription
    {
        public int Type { get; set; }
        public List<int> Values { get; set; } = new List<int>();
        public List<string> ValueTypes { get; set; } = new List<string>();
    }
    
    /// <summary>
    /// Represents an ongoing campaign on a planet
    /// </summary>
    public class Campaign
    {
        /// <summary>
        /// The unique identifier of this Campaign
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// The planet on which this campaign is being fought
        /// </summary>
        public Planet? Planet { get; set; }
        
        /// <summary>
        /// The type of campaign (should be mapped onto an enum in the future)
        /// </summary>
        public int Type { get; set; }
        
        /// <summary>
        /// Indicates how many campaigns have already been fought on this Planet
        /// </summary>
        public ulong Count { get; set; }
        
        /// <summary>
        /// The faction that is currently fighting this campaign
        /// </summary>
        public string Faction { get; set; } = string.Empty;
    }
    
    /// <summary>
    /// A message from high command to the players, usually updates on the status of the war effort
    /// </summary>
    public class Dispatch
    {
        /// <summary>
        /// The unique identifier of this dispatch
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// When the dispatch was published
        /// </summary>
        public DateTime Published { get; set; }
        
        /// <summary>
        /// The type of dispatch (purpose unknown)
        /// </summary>
        public int Type { get; set; }
        
        /// <summary>
        /// The message this dispatch represents
        /// </summary>
        public string Message { get; set; } = string.Empty;
    }
    
    /// <summary>
    /// Represents a new article from Steam's news feed
    /// </summary>
    public class SteamNews
    {
        /// <summary>
        /// The identifier assigned by Steam to this news item
        /// </summary>
        public string Id { get; set; } = string.Empty;
        
        /// <summary>
        /// The title of the Steam news item
        /// </summary>
        public string Title { get; set; } = string.Empty;
        
        /// <summary>
        /// The URL to Steam where this news item was posted
        /// </summary>
        public string Url { get; set; } = string.Empty;
        
        /// <summary>
        /// The author who posted this message on Steam
        /// </summary>
        public string Author { get; set; } = string.Empty;
        
        /// <summary>
        /// The message posted by Steam, currently in Steam's weird markdown format
        /// </summary>
        public string Content { get; set; } = string.Empty;
        
        /// <summary>
        /// When this message was posted
        /// </summary>
        public DateTime PublishedAt { get; set; }
    }
    
    /// <summary>
    /// Represents a Super Earth Democracy Space Station
    /// </summary>
    public class SpaceStation
    {
        /// <summary>
        /// The unique identifier of the station
        /// </summary>
        public long Id32 { get; set; }
        
        /// <summary>
        /// The planet it's currently orbiting
        /// </summary>
        public Planet? Planet { get; set; }
        
        /// <summary>
        /// When the election for the next planet will end
        /// </summary>
        public DateTime ElectionEnd { get; set; }
        
        /// <summary>
        /// A set of flags (purpose currently unknown)
        /// </summary>
        public int Flags { get; set; }
        
        /// <summary>
        /// A list of tactical actions the space station supports
        /// </summary>
        public List<TacticalAction> TacticalActions { get; set; } = new List<TacticalAction>();
    }
    
    /// <summary>
    /// Represents a tactical action that the Space Station can take
    /// </summary>
    public class TacticalAction
    {
        public long Id32 { get; set; }
        public long MediaId32 { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string StrategicDescription { get; set; } = string.Empty;
        public int Status { get; set; }
        public DateTime StatusExpire { get; set; }
        public List<Cost> Costs { get; set; } = new List<Cost>();
        public List<int> EffectIds { get; set; } = new List<int>();
    }
    
    /// <summary>
    /// Represents the "Cost" of a tactical action
    /// </summary>
    public class Cost
    {
        public string Id { get; set; } = string.Empty;
        public long ItemMixId { get; set; }
        public long TargetValue { get; set; }
        public double CurrentValue { get; set; }
        public double DeltaPerSecond { get; set; }
        public long MaxDonationAmmount { get; set; }
        public long MaxDonationPeriodSeconds { get; set; }
    }
}
