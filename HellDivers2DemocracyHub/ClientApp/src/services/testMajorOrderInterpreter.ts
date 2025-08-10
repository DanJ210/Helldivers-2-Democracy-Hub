import { majorOrderInterpreter } from './majorOrderInterpreter'
import type { MajorOrder, Planet } from '@/types/helldivers2'

// Test with sample data similar to the API response
const sampleMajorOrder: MajorOrder = {
  id: 712986680,
  progress: [1, 1, 0, 1, 825678],
  title: "MAJOR ORDER",
  briefing: "Liberate the Nanos Sector, and destroy Automaton Conscripts with the Railcannon Stratagem to further secure New Aspiration City.",
  description: null,
  tasks: [
    {
      type: 11, // Liberation task
      values: [1, 1, 111],
      valueTypes: [3, 11, 12]
    },
    {
      type: 11, // Liberation task
      values: [1, 1, 72],
      valueTypes: [3, 11, 12]
    },
    {
      type: 11, // Liberation task
      values: [1, 1, 110],
      valueTypes: [3, 11, 12]
    },
    {
      type: 11, // Liberation task
      values: [1, 1, 109],
      valueTypes: [3, 11, 12]
    },
    {
      type: 3, // Elimination task
      values: [3, 0, 2500000, 4039692928, 1, 2197477188, 0, 0, 0, 0],
      valueTypes: [1, 2, 3, 4, 6, 5, 8, 9, 11, 12]
    }
  ],
  reward: {
    type: 1,
    amount: 50
  },
  rewards: [
    {
      type: 1,
      amount: 50
    }
  ],
  expiration: "2025-08-13T06:52:30.0724805Z",
  flags: 0
}

const samplePlanets: Planet[] = [
  {
    index: 111,
    name: "Acamar IV",
    sector: "Nanos Sector",
    biome: { name: "Desert", description: "Arid desert world" },
    hazards: [],
    position: { x: 0, y: 0 },
    waypoints: [],
    maxHealth: 1000000,
    health: 500000,
    disabled: false,
    initialOwner: 3,
    currentOwner: 3,
    regenPerSecond: [],
    event: []
  },
  {
    index: 72,
    name: "Estanu",
    sector: "Nanos Sector", 
    biome: { name: "Jungle", description: "Dense jungle world" },
    hazards: [],
    position: { x: 0, y: 0 },
    waypoints: [],
    maxHealth: 1000000,
    health: 800000,
    disabled: false,
    initialOwner: 3,
    currentOwner: 3,
    regenPerSecond: [],
    event: []
  }
]

// Update interpreter with planet data
majorOrderInterpreter.updatePlanets(samplePlanets)

// Test the interpretation
const interpreted = majorOrderInterpreter.interpretMajorOrder(sampleMajorOrder)

console.log('=== Major Order Interpretation Test ===')
console.log('Title:', interpreted.title)
console.log('Completion:', `${interpreted.completionPercentage}%`)
console.log('Time Remaining:', interpreted.timeRemaining)
console.log('Is Expiring Soon:', interpreted.isExpiringSoon)
console.log('\nTasks:')
interpreted.tasks.forEach((task, index) => {
  console.log(`  ${index + 1}. ${task.type}: ${task.description}`)
  console.log(`     Status: ${task.isCompleted ? 'Complete' : 'In Progress'}`)
  console.log(`     Details: ${task.completionDetails}`)
  if (task.planetName) console.log(`     Planet: ${task.planetName}`)
  if (task.stratagemRequired) console.log(`     Requires Stratagem`)
  console.log('')
})

console.log('Rewards:')
interpreted.rewards.forEach(reward => {
  console.log(`  ${reward.icon} ${reward.amount} ${reward.type}`)
})

export { interpreted }
