export interface WarStatus {
  id: number
  name: string
  started: string
  ended: string
  clientVersion: number
  factionIndex: number
  impactMultiplier: number
  planets: Planet[]
  statistics: Statistics
}

export interface Planet {
  index: number
  name: string
  sector: string
  biome: Biome
  hazards: string[]
  position: Position
  waypoints: number[]
  maxHealth: number
  health: number
  disabled: boolean
  initialOwner: number
  currentOwner: number
  regenPerSecond: RegenEvent[]
  event: Event[]
}

export interface Biome {
  name: string
  description: string
}

export interface Position {
  x: number
  y: number
}

export interface RegenEvent {
  index: number
  value: number
}

export interface Event {
  id: number
  eventType: number
  faction: number
  maxHealth: number
  health: number
  startTime: string
  endTime: string
  campaignType: number
  jointOperationIds: number
}

export interface Statistics {
  missionsWon: number
  missionsLost: number
  missionTime: number
  terminidKills: number
  automatonKills: number
  illuminateKills: number
  bulletsFired: number
  bulletsHit: number
  timePlayed: number
  deaths: number
  revives: number
  friendlies: number
  missionSuccessRate: number
  accuracy: number
  playerCount: number
}

/**
 * Represents a Major Order (Assignment) from Super Earth to the Helldivers community.
 * Maps to the Assignment2 schema from the Helldivers 2 Community API.
 */
export interface MajorOrder {
  /** The unique identifier of this assignment */
  id: number
  /** Progress tracking array with numbers representing completion progress */
  progress: number[]
  /** The title of the assignment */
  title: string
  /** Long form description with context and story elements */
  briefing: string
  /** Short summary of the assignment (can be null) */
  description: string | null
  /** List of tasks that need to be completed */
  tasks: Task2[]
  /** Primary reward for completion (can be null) */
  reward: Reward2 | null
  /** Complete list of all rewards */
  rewards: Reward2[]
  /** When the assignment expires */
  expiration: string
  /** Assignment flags for special behaviors */
  flags: number
}

/**
 * Represents a task within a Major Order that needs to be completed.
 */
export interface Task2 {
  /** The type of task (different types have different objectives) */
  type: number
  /** Numerical values for task requirements or progress */
  values: number[]
  /** Identifiers defining what each value represents */
  valueTypes: number[]
}

/**
 * Task type constants for Major Orders
 */
export const TASK_TYPES = {
  ELIMINATE: 3,        // Kill objectives (eliminate X enemies)
  LIBERATE: 11,        // Planet liberation objectives
  // Add more as they are discovered
} as const

/**
 * Value type constants that define what task values represent
 */
export const VALUE_TYPES = {
  FACTION: 1,          // Enemy faction identifier
  UNKNOWN_2: 2,        // Unknown purpose
  TARGET_AMOUNT: 3,    // Target/goal amount
  ENEMY_TYPE: 4,       // Specific enemy type identifier
  STRATAGEM_ID: 5,     // Stratagem identifier for elimination tasks
  REQUIREMENT: 6,      // General requirement flag
  UNKNOWN_8: 8,        // Unknown purpose
  UNKNOWN_9: 9,        // Unknown purpose
  SECTOR: 11,          // Sector identifier
  PLANET_INDEX: 12,    // Planet index for liberation tasks
} as const

/**
 * Reward type constants
 */
export const REWARD_TYPES = {
  MEDALS: 1,           // Medals - primary currency
  SUPER_CREDITS: 2,    // Super Credits - premium currency
  EXPERIENCE: 3,       // Experience points
  WARBOND: 4,          // Warbond unlocks
} as const

/**
 * Enemy faction constants
 */
export const FACTIONS = {
  SUPER_EARTH: 0,      // Super Earth (Humans)
  TERMINIDS: 2,        // Bug faction
  AUTOMATONS: 3,       // Robot faction
  ILLUMINATE: 4,       // Illuminate faction
} as const

/**
 * Represents a reward for completing a Major Order.
 */
export interface Reward2 {
  /** Type of reward (1 = Medals, etc.) */
  type: number
  /** Amount of the reward to be awarded */
  amount: number
}

/** Legacy interface - kept for backward compatibility */
export interface Setting {
  type: number
  overrideTitle: number
  overrideBrief: number
  taskDescription: TaskDescription[]
  reward: number[]
  flags: number[]
}

/** Legacy interface - kept for backward compatibility */
export interface TaskDescription {
  type: number
  values: number[]
  valueTypes: string[]
}

export interface DashboardData {
  warStatus: WarStatus | null
  majorOrders: MajorOrder[]
  statistics: Statistics | null
  planets: Planet[]
  lastUpdated: string
}

/**
 * Represents an ongoing campaign on a planet
 */
export interface Campaign {
  /** The unique identifier of this Campaign */
  id: number
  /** The planet on which this campaign is being fought */
  planet?: Planet
  /** The type of campaign */
  type: number
  /** Indicates how many campaigns have already been fought on this Planet */
  count: number
  /** The faction that is currently fighting this campaign */
  faction: string
}

/**
 * A message from high command to the players, usually updates on the status of the war effort
 */
export interface Dispatch {
  /** The unique identifier of this dispatch */
  id: number
  /** When the dispatch was published */
  published: string
  /** The type of dispatch */
  type: number
  /** The message this dispatch represents */
  message: string
}

/**
 * Represents a new article from Steam's news feed
 */
export interface SteamNews {
  /** The identifier assigned by Steam to this news item */
  id: string
  /** The title of the Steam news item */
  title: string
  /** The URL to Steam where this news item was posted */
  url: string
  /** The author who posted this message on Steam */
  author: string
  /** The message posted by Steam */
  content: string
  /** When this message was posted */
  publishedAt: string
}

/**
 * Represents a Super Earth Democracy Space Station
 */
export interface SpaceStation {
  /** The unique identifier of the station */
  id32: number
  /** The planet it's currently orbiting */
  planet?: Planet
  /** When the election for the next planet will end */
  electionEnd: string
  /** A set of flags */
  flags: number
  /** A list of tactical actions the space station supports */
  tacticalActions: TacticalAction[]
}

/**
 * Represents a tactical action that the Space Station can take
 */
export interface TacticalAction {
  id32: number
  mediaId32: number
  name: string
  description: string
  strategicDescription: string
  status: number
  statusExpire: string
  costs: Cost[]
  effectIds: number[]
}

/**
 * Represents the "Cost" of a tactical action
 */
export interface Cost {
  id: string
  itemMixId: number
  targetValue: number
  currentValue: number
  deltaPerSecond: number
  maxDonationAmmount: number
  maxDonationPeriodSeconds: number
}
