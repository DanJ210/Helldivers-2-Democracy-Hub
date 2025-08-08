namespace HellDivers2DemocracyHub.Models
{
    public class WarStatus
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime Started { get; set; }
        public DateTime Ended { get; set; }
        public int ClientVersion { get; set; }
        public int FactionIndex { get; set; }
        public int ImpactMultiplier { get; set; }
        public List<Planet> Planets { get; set; } = new List<Planet>();
        public Statistics Statistics { get; set; } = new Statistics();
    }

    public class Planet
    {
        public int Index { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Sector { get; set; } = string.Empty;
        public Biome Biome { get; set; } = new Biome();
        public List<string> Hazards { get; set; } = new List<string>();
        public Position Position { get; set; } = new Position();
        public List<int> Waypoints { get; set; } = new List<int>();
        public int MaxHealth { get; set; }
        public int Health { get; set; }
        public bool Disabled { get; set; }
        public int InitialOwner { get; set; }
        public int CurrentOwner { get; set; }
        public List<RegenEvent> RegenPerSecond { get; set; } = new List<RegenEvent>();
        public List<Event> Event { get; set; } = new List<Event>();
    }

    public class Biome
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class Position
    {
        public double X { get; set; }
        public double Y { get; set; }
    }

    public class RegenEvent
    {
        public int Index { get; set; }
        public double Value { get; set; }
    }

    public class Event
    {
        public int Id { get; set; }
        public int EventType { get; set; }
        public int Faction { get; set; }
        public int MaxHealth { get; set; }
        public int Health { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int CampaignType { get; set; }
        public int JointOperationIds { get; set; }
    }

    public class Statistics
    {
        public int MissionsWon { get; set; }
        public int MissionsLost { get; set; }
        public int MissionTime { get; set; }
        public int BugKills { get; set; }
        public int AutomatonKills { get; set; }
        public int IlluminateKills { get; set; }
        public int BulletsFired { get; set; }
        public int BulletsHit { get; set; }
        public int TimePlayed { get; set; }
        public int Deaths { get; set; }
        public int Revives { get; set; }
        public int Friendlies { get; set; }
        public int MissionSuccessRate { get; set; }
        public int Accuracy { get; set; }
        public long PlayerCount { get; set; }
    }

    public class MajorOrder
    {
        public int Id32 { get; set; }
        public long Id64 { get; set; }
        public int Progress { get; set; }
        public DateTime ExpiresIn { get; set; }
        public Setting Setting { get; set; } = new Setting();
    }

    public class Setting
    {
        public int Type { get; set; }
        public int OverrideTitle { get; set; }
        public int OverrideBrief { get; set; }
        public List<TaskDescription> TaskDescription { get; set; } = new List<TaskDescription>();
        public List<int> Reward { get; set; } = new List<int>();
        public List<int> Flags { get; set; } = new List<int>();
    }

    public class TaskDescription
    {
        public int Type { get; set; }
        public List<int> Values { get; set; } = new List<int>();
        public List<string> ValueTypes { get; set; } = new List<string>();
    }
}
