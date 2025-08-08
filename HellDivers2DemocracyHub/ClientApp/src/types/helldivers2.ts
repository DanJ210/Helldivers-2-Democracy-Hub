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
  bugKills: number
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

export interface MajorOrder {
  id32: number
  id64: number
  progress: number
  expiresIn: string
  setting: Setting
}

export interface Setting {
  type: number
  overrideTitle: number
  overrideBrief: number
  taskDescription: TaskDescription[]
  reward: number[]
  flags: number[]
}

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
