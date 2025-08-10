import type { MajorOrder, Task2, Planet } from '@/types/helldivers2'
import { TASK_TYPES, VALUE_TYPES, REWARD_TYPES, FACTIONS } from '@/types/helldivers2'

export interface TaskInterpretation {
  type: 'liberation' | 'elimination' | 'unknown'
  description: string
  target?: string
  planetName?: string
  enemyType?: string
  stratagemRequired?: boolean
  targetAmount?: number
  isCompleted: boolean
  completionDetails?: string
}

export interface MajorOrderInterpretation {
  id: number
  title: string
  briefing: string
  description: string | null
  timeRemaining: string
  isExpiringSoon: boolean
  isExpired: boolean
  completionPercentage: number
  tasks: TaskInterpretation[]
  rewards: Array<{
    type: string
    amount: number
    icon: string
  }>
  flags: number
}

export class MajorOrderInterpreter {
  private planets: Planet[] = []

  constructor(planets: Planet[] = []) {
    this.planets = planets
  }

  updatePlanets(planets: Planet[]) {
    this.planets = planets
  }

  /**
   * Get planet name by index
   */
  private getPlanetName(planetIndex: number): string {
    const planet = this.planets.find(p => p.index === planetIndex)
    return planet ? planet.name : `Planet ${planetIndex}`
  }

  /**
   * Get faction name by index
   */
  private getFactionName(factionIndex: number): string {
    switch (factionIndex) {
      case FACTIONS.SUPER_EARTH: return 'Super Earth'
      case FACTIONS.TERMINIDS: return 'Terminids'
      case FACTIONS.AUTOMATONS: return 'Automatons'
      case FACTIONS.ILLUMINATE: return 'Illuminate'
      default: return `Faction ${factionIndex}`
    }
  }

  /**
   * Get reward type name and icon
   */
  private getRewardInfo(type: number): { name: string; icon: string } {
    switch (type) {
      case REWARD_TYPES.MEDALS: return { name: 'Medals', icon: '🏅' }
      case REWARD_TYPES.SUPER_CREDITS: return { name: 'Super Credits', icon: '💰' }
      case REWARD_TYPES.EXPERIENCE: return { name: 'Experience', icon: '⭐' }
      case REWARD_TYPES.WARBOND: return { name: 'Warbond Unlock', icon: '📖' }
      default: return { name: 'Unknown Reward', icon: '🎁' }
    }
  }

  /**
   * Calculate time remaining and expiration status
   */
  private calculateTimeInfo(expiration: string): { timeRemaining: string; isExpiringSoon: boolean; isExpired: boolean } {
    const expirationDate = new Date(expiration)
    const now = new Date()
    const timeDiff = expirationDate.getTime() - now.getTime()
    
    if (timeDiff <= 0) {
      return { timeRemaining: 'Expired', isExpiringSoon: false, isExpired: true }
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    
    let timeRemaining = ''
    if (days > 0) {
      timeRemaining = `${days}d ${hours}h`
    } else if (hours > 0) {
      timeRemaining = `${hours}h ${minutes}m`
    } else {
      timeRemaining = `${minutes}m`
    }
    
    const hoursUntilExpiration = timeDiff / (1000 * 60 * 60)
    const isExpiringSoon = hoursUntilExpiration <= 24
    
    return { timeRemaining, isExpiringSoon, isExpired: false }
  }

  /**
   * Interpret a single task
   */
  private interpretTask(task: Task2, taskIndex: number, progress: number[]): TaskInterpretation {
    const progressValue = progress[taskIndex] || 0
    
    // Create a map of value types to their corresponding values
    const valueMap = new Map<number, number>()
    task.valueTypes.forEach((type, index) => {
      if (task.values[index] !== undefined) {
        valueMap.set(type, task.values[index])
      }
    })

    switch (task.type) {
      case TASK_TYPES.LIBERATE: {
        // Planet liberation task
        const planetIndex = valueMap.get(VALUE_TYPES.PLANET_INDEX)
        const planetName = planetIndex ? this.getPlanetName(planetIndex) : 'Unknown Planet'
        const isCompleted = progressValue === 1
        
        return {
          type: 'liberation',
          description: `Liberate ${planetName}`,
          planetName,
          isCompleted,
          completionDetails: isCompleted ? 'Liberation Complete' : 'In Progress'
        }
      }
      
      case TASK_TYPES.ELIMINATE: {
        // Enemy elimination task
        const targetAmount = valueMap.get(VALUE_TYPES.TARGET_AMOUNT) || 0
        const factionId = valueMap.get(VALUE_TYPES.FACTION)
        const enemyTypeId = valueMap.get(VALUE_TYPES.ENEMY_TYPE)
        const stratagemId = valueMap.get(VALUE_TYPES.STRATAGEM_ID)
        
        let description = 'Eliminate enemies'
        let enemyType = 'enemies'
        
        if (factionId) {
          enemyType = this.getFactionName(factionId)
          description = `Eliminate ${targetAmount.toLocaleString()} ${enemyType}`
        }
        
        if (stratagemId) {
          description += ' using specific stratagem'
        }
        
        const currentProgress = progressValue || 0
        const completionPercentage = targetAmount > 0 ? Math.min((currentProgress / targetAmount) * 100, 100) : 0
        const isCompleted = currentProgress >= targetAmount
        
        return {
          type: 'elimination',
          description,
          enemyType,
          targetAmount,
          stratagemRequired: !!stratagemId,
          isCompleted,
          completionDetails: `${currentProgress.toLocaleString()} / ${targetAmount.toLocaleString()} (${completionPercentage.toFixed(1)}%)`
        }
      }
      
      default: {
        // Unknown task type
        return {
          type: 'unknown',
          description: `Task Type ${task.type}`,
          isCompleted: progressValue === 1,
          completionDetails: `Progress: ${progressValue}`
        }
      }
    }
  }

  /**
   * Calculate overall completion percentage
   */
  private calculateCompletionPercentage(tasks: TaskInterpretation[]): number {
    if (tasks.length === 0) return 0
    
    const completedTasks = tasks.filter(task => task.isCompleted).length
    return (completedTasks / tasks.length) * 100
  }

  /**
   * Interpret a complete Major Order
   */
  interpretMajorOrder(majorOrder: MajorOrder): MajorOrderInterpretation {
    // Interpret time information
    const timeInfo = this.calculateTimeInfo(majorOrder.expiration)
    
    // Interpret tasks
    const tasks = majorOrder.tasks.map((task, index) => 
      this.interpretTask(task, index, majorOrder.progress)
    )
    
    // Calculate completion percentage
    const completionPercentage = this.calculateCompletionPercentage(tasks)
    
    // Interpret rewards
    const rewards = majorOrder.rewards.map(reward => {
      const rewardInfo = this.getRewardInfo(reward.type)
      return {
        type: rewardInfo.name,
        amount: reward.amount,
        icon: rewardInfo.icon
      }
    })
    
    return {
      id: majorOrder.id,
      title: majorOrder.title,
      briefing: majorOrder.briefing,
      description: majorOrder.description,
      timeRemaining: timeInfo.timeRemaining,
      isExpiringSoon: timeInfo.isExpiringSoon,
      isExpired: timeInfo.isExpired,
      completionPercentage,
      tasks,
      rewards,
      flags: majorOrder.flags
    }
  }

  /**
   * Interpret multiple Major Orders
   */
  interpretMajorOrders(majorOrders: MajorOrder[]): MajorOrderInterpretation[] {
    return majorOrders.map(order => this.interpretMajorOrder(order))
  }
}

// Export a singleton instance
export const majorOrderInterpreter = new MajorOrderInterpreter()
