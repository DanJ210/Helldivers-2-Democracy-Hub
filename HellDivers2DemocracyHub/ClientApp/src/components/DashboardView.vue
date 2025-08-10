<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
    <!-- Header -->
    <header class="hd-card-header text-center py-8 mb-8">
      <h1 class="hd-heading-1 text-yellow-400">🚀 HELLDIVERS 2 DEMOCRACY HUB 🚀</h1>
      <p class="hd-text-body mt-3">Serving Super Earth since 2184</p>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <p class="hd-text-body text-lg">📡 Establishing connection with Super Earth High Command...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <p class="text-red-400 text-lg mb-4">⚠️ Communication error with Super Earth: {{ error }}</p>
      <button @click="loadDashboard" class="hd-button-primary">Retry Connection</button>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="hd-dashboard-grid max-w-7xl mx-auto px-6 pb-8">

      <!-- 1. Major Orders -->
      <div class="hd-card lg:col-span-2">
        <h2 class="hd-heading-2 mb-6">🎯 Major Orders</h2>
        
        <div v-if="interpretedMajorOrders.length === 0" class="hd-text-body text-center py-8">
          <p>No active major orders from Super Earth High Command</p>
        </div>
        
        <div v-else class="space-y-6">
          <div v-for="order in interpretedMajorOrders" :key="order.id" class="border border-yellow-500/30 bg-yellow-500/5 rounded-xl p-6">
            
            <!-- Order Header -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
              <div>
                <h3 class="hd-heading-3 text-yellow-400 mb-2">{{ order.title }}</h3>
                <span class="inline-block bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                  Order #{{ order.id }}
                </span>
              </div>
              
              <div class="flex flex-col items-end gap-2">
                <!-- Completion Percentage -->
                <div class="px-3 py-1 rounded-full text-sm font-bold" :class="getCompletionTailwindClass(order.completionPercentage)">
                  📊 {{ order.completionPercentage.toFixed(1) }}% Complete
                </div>
                
                <!-- Expiration -->
                <div class="px-3 py-1 rounded-full text-sm font-medium" 
                     :class="getExpirationClasses(order)">
                  ⏰ {{ order.timeRemaining }}
                </div>
                
                <!-- Flags -->
                <div v-if="order.flags" class="text-slate-400 text-sm">
                  🏷️ Flags: {{ order.flags }}
                </div>
              </div>
            </div>

            <!-- Order Content -->
            <div class="space-y-4">
              <!-- Briefing -->
              <div class="bg-slate-800/50 rounded-lg p-4">
                <p class="hd-text-body leading-relaxed">{{ order.briefing }}</p>
                <p v-if="order.description" class="hd-text-body text-slate-300 italic mt-2">{{ order.description }}</p>
              </div>

              <!-- Tasks Section -->
              <div v-if="order.tasks.length > 0" class="bg-slate-800/30 rounded-lg p-4">
                <h4 class="hd-heading-3 text-blue-400 mb-4">🎯 Mission Objectives</h4>
                <div class="space-y-3">
                  <div v-for="(task, index) in order.tasks" :key="index" 
                       class="p-3 rounded-lg border-l-4 transition-all" 
                       :class="task.isCompleted ? 'border-green-500 bg-green-500/10' : 'border-slate-500 bg-slate-700/30'">
                    
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-3">
                        <span class="text-xl">{{ getTaskIcon(task) }}</span>
                        <span class="hd-text-body font-medium">{{ task.description }}</span>
                      </div>
                      <span class="px-2 py-1 rounded text-xs font-bold" :class="task.isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'">
                        {{ task.isCompleted ? '✅ Complete' : '🔄 In Progress' }}
                      </span>
                    </div>
                    
                    <div v-if="task.completionDetails" class="text-slate-300 text-sm font-mono mt-2">
                      {{ task.completionDetails }}
                    </div>
                    
                    <div v-if="task.stratagemRequired" class="text-blue-400 text-sm italic mt-2">
                      ⚡ Specific stratagem required
                    </div>
                  </div>
                </div>
              </div>

              <!-- Rewards Section -->
              <div class="bg-slate-800/30 rounded-lg p-4">
                <h4 class="hd-heading-3 text-blue-400 mb-4">🏆 Rewards</h4>
                <div v-if="order.rewards.length === 0" class="text-slate-400 text-center py-4 italic">
                  No rewards specified
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div v-for="(reward, index) in order.rewards" :key="index" 
                       class="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                    <div class="flex items-center gap-2">
                      <span class="text-xl">{{ reward.icon }}</span>
                      <span class="hd-text-body">{{ reward.type }}</span>
                    </div>
                    <span class="font-bold text-green-400">{{ reward.amount.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. High Command Dispatches -->
      <div class="hd-card">
        <h2 class="hd-heading-2 mb-6">📻 High Command Dispatches</h2>
        
        <div v-if="recentDispatches.length === 0" class="text-center py-8">
          <p class="hd-text-body text-slate-400 italic">📡 Connecting to High Command...</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="dispatch in recentDispatches" :key="dispatch.id" 
               class="border border-green-500/30 bg-green-500/5 rounded-lg p-4">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <span class="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                Dispatch #{{ dispatch.id }}
              </span>
              <span class="text-slate-400 text-sm">{{ formatDate(dispatch.published) }}</span>
            </div>
            <div class="hd-text-body leading-relaxed" v-html="dispatch.message"></div>
          </div>
        </div>
      </div>

      <!-- 3. War Statistics -->
      <div class="hd-card lg:col-span-2">
        <h2 class="hd-heading-2 mb-6">📊 War Statistics</h2>
        
        <div v-if="dashboardData?.statistics" class="space-y-6">
          
          <!-- Mission Statistics -->
          <div class="hd-stats-section">
            <h3 class="hd-heading-3 text-blue-400 mb-4">🚀 Mission Performance</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="hd-stat-item">
                <span class="hd-stat-label">Missions Won:</span>
                <span class="hd-stat-value text-green-400">{{ dashboardData.statistics.missionsWon.toLocaleString() }}</span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">Missions Lost:</span>
                <span class="hd-stat-value text-red-400">{{ dashboardData.statistics.missionsLost.toLocaleString() }}</span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">Success Rate:</span>
                <span class="hd-stat-value" :class="getTailwindSuccessRateClass(dashboardData.statistics.missionSuccessRate)">
                  {{ dashboardData.statistics.missionSuccessRate }}%
                </span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">Mission Time:</span>
                <span class="hd-stat-value">{{ formatDuration(dashboardData.statistics.missionTime) }}</span>
              </div>
            </div>
          </div>

          <!-- Enemy Elimination Statistics -->
          <div class="hd-stats-section">
            <h3 class="hd-heading-3 text-blue-400 mb-4">💀 Enemy Casualties</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="hd-stat-item">
                <span class="hd-stat-label">🐛 Terminid Kills:</span>
                <span class="hd-stat-value text-orange-400">{{ dashboardData.statistics.terminidKills.toLocaleString() }}</span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">🤖 Automaton Kills:</span>
                <span class="hd-stat-value text-red-500">{{ dashboardData.statistics.automatonKills.toLocaleString() }}</span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">👁️ Illuminate Kills:</span>
                <span class="hd-stat-value text-purple-400">{{ dashboardData.statistics.illuminateKills.toLocaleString() }}</span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">Total Kills:</span>
                <span class="hd-stat-value text-green-500 text-lg font-bold">{{ getTotalKills(dashboardData.statistics).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Combat Statistics -->
          <div class="hd-stats-section">
            <h3 class="hd-heading-3 text-blue-400 mb-4">⚔️ Combat Performance</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="hd-stat-item">
                <span class="hd-stat-label">Bullets Fired:</span>
                <span class="hd-stat-value">{{ dashboardData.statistics.bulletsFired.toLocaleString() }}</span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">Bullets Hit:</span>
                <span class="hd-stat-value">{{ dashboardData.statistics.bulletsHit.toLocaleString() }}</span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">Accuracy:</span>
                <span class="hd-stat-value" :class="getTailwindAccuracyClass(dashboardData.statistics.accuracy)">
                  {{ dashboardData.statistics.accuracy }}%
                </span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">Friendly Fire:</span>
                <span class="hd-stat-value text-red-400">{{ dashboardData.statistics.friendlies.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Helldivers Statistics -->
          <div class="hd-stats-section">
            <h3 class="hd-heading-3 text-blue-400 mb-4">🪖 Helldivers Status</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="hd-stat-item">
                <span class="hd-stat-label">Active Helldivers:</span>
                <span class="hd-stat-value text-blue-400 text-lg font-bold hd-pulse">{{ dashboardData.statistics.playerCount.toLocaleString() }}</span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">Total Deaths:</span>
                <span class="hd-stat-value text-red-400">{{ dashboardData.statistics.deaths.toLocaleString() }}</span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">Revives:</span>
                <span class="hd-stat-value text-green-400">{{ dashboardData.statistics.revives.toLocaleString() }}</span>
              </div>
              <div class="hd-stat-item">
                <span class="hd-stat-label">Total Playtime:</span>
                <span class="hd-stat-value">{{ formatDuration(dashboardData.statistics.timePlayed) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Current War Status -->
      <div class="hd-card">
        <h2 class="hd-heading-2 mb-6">🌍 Current War Status</h2>
        <div v-if="dashboardData?.warStatus" class="space-y-4">
          <h3 class="hd-heading-3 text-yellow-400">{{ dashboardData.warStatus.name }}</h3>
          <div class="space-y-3">
            <div class="hd-stat-item">
              <span class="hd-stat-label">War Started:</span>
              <span class="hd-stat-value">{{ formatDate(dashboardData.warStatus.started) }}</span>
            </div>
            <div class="hd-stat-item">
              <span class="hd-stat-label">Active Planets:</span>
              <span class="hd-stat-value">{{ dashboardData.planets.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Galaxy Status -->
      <div class="hd-card">
        <h2 class="hd-heading-2 mb-6">🌌 Galaxy Status</h2>
        <div v-if="dashboardData?.planets" class="space-y-3">
          <div v-for="planet in getActivePlanets()" :key="planet.index" 
               class="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border-l-4 border-blue-400">
            <div>
              <div class="font-semibold text-slate-100">{{ planet.name }}</div>
              <div class="text-sm text-slate-400">{{ planet.sector }}</div>
            </div>
            <div class="text-right">
              <div class="font-bold" :class="{
                'text-green-400': getHealthPercentage(planet) > 75,
                'text-yellow-400': getHealthPercentage(planet) > 50 && getHealthPercentage(planet) <= 75,
                'text-orange-400': getHealthPercentage(planet) > 25 && getHealthPercentage(planet) <= 50,
                'text-red-400': getHealthPercentage(planet) <= 25
              }">
                {{ getHealthPercentage(planet) }}%
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    
    <!-- Footer -->
    <footer class="text-center mt-12 pt-8 border-t border-slate-700 text-slate-400">
      <p class="mb-2">Last updated: {{ lastUpdated }}</p>
      <p class="font-bold text-yellow-400">FOR DEMOCRACY! FOR SUPER EARTH!</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { HellDivers2ApiService } from '@/services/helldivers2Api'
import { majorOrderInterpreter, type MajorOrderInterpretation } from '@/services/majorOrderInterpreter'
import type { DashboardData, Planet, Dispatch } from '@/types/helldivers2'

const dashboardData = ref<DashboardData | null>(null)
const interpretedMajorOrders = ref<MajorOrderInterpretation[]>([])
const recentDispatches = ref<Dispatch[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const lastUpdated = computed(() => {
  if (dashboardData.value?.lastUpdated) {
    return new Date(dashboardData.value.lastUpdated).toLocaleString()
  }
  return 'Unknown'
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getHealthPercentage = (planet: Planet) => {
  if (planet.maxHealth === 0) return 0
  return Math.round((planet.health / planet.maxHealth) * 100)
}

const getActivePlanets = () => {
  if (!dashboardData.value?.planets) return []
  return dashboardData.value.planets
    .filter((planet: Planet) => !planet.disabled)
    .slice(0, 10) // Show top 10 planets
}

const isExpiringSoon = (expirationDate: string) => {
  const expiration = new Date(expirationDate)
  const now = new Date()
  const hoursUntilExpiration = (expiration.getTime() - now.getTime()) / (1000 * 60 * 60)
  return hoursUntilExpiration <= 24 // Less than 24 hours
}

const formatTimeRemaining = (expirationDate: string) => {
  const expiration = new Date(expirationDate)
  const now = new Date()
  const timeDiff = expiration.getTime() - now.getTime()
  
  if (timeDiff <= 0) {
    return "Expired"
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) {
    return `${days}d ${hours}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

const formatDuration = (seconds: number) => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

const getTotalKills = (statistics: any) => {
  return statistics.terminidKills + statistics.automatonKills + statistics.illuminateKills
}

// Tailwind CSS class functions for dynamic styling
const getCompletionTailwindClass = (percentage: number) => {
  if (percentage >= 100) return 'bg-green-500/20 text-green-400'
  if (percentage >= 75) return 'bg-lime-500/20 text-lime-400'
  if (percentage >= 50) return 'bg-yellow-500/20 text-yellow-400'
  if (percentage >= 25) return 'bg-orange-500/20 text-orange-400'
  return 'bg-red-500/20 text-red-400'
}

const getTailwindSuccessRateClass = (successRate: number) => {
  if (successRate >= 90) return 'text-green-400'
  if (successRate >= 75) return 'text-yellow-400'
  return 'text-red-400'
}

const getTailwindAccuracyClass = (accuracy: number) => {
  if (accuracy >= 75) return 'text-green-400'
  if (accuracy >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

const getExpirationClasses = (order: any) => {
  if (order.isExpired) {
    return 'bg-slate-500/20 text-slate-400 line-through'
  } else if (order.isExpiringSoon) {
    return 'bg-red-500/20 text-red-400 hd-pulse'  
  } else {
    return 'bg-green-500/20 text-green-400'
  }
}

const getRewardIcon = (type: number) => {
  switch (type) {
    case 1: return '🏅'
    case 2: return '💰' 
    case 3: return '⭐'
    default: return '🎁'
  }
}

const getRewardTypeName = (type: number) => {
  switch (type) {
    case 1: return 'Medals'
    case 2: return 'Super Credits'
    case 3: return 'Experience'
    default: return 'Unknown'
  }
}

const getTaskIcon = (task: any) => {
  switch (task.type) {
    case 'liberation': return '🏛️'
    case 'elimination': return '⚔️'
    default: return '🎯'
  }
}

const loadDashboard = async () => {
  try {
    loading.value = true
    error.value = null
    
    const data = await HellDivers2ApiService.getDashboard()
    dashboardData.value = data
    
    // Update the interpreter with current planet data
    if (data.planets.length > 0) {
      majorOrderInterpreter.updatePlanets(data.planets)
    }
    
    // Interpret major orders for better display
    interpretedMajorOrders.value = majorOrderInterpreter.interpretMajorOrders(data.majorOrders)
    
    const dispatches = await HellDivers2ApiService.getDispatches()
    recentDispatches.value = dispatches.slice(0, 3)
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load dashboard'
    console.error('Dashboard load error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<style scoped>
@reference "tailwindcss";
/* Custom animations and effects that can't be achieved with Tailwind alone */

/* Enhanced pulse animation for active player count */
.hd-pulse {
  animation: enhanced-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes enhanced-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

/* Stat item hover effect */
.hd-stat-item {
  @apply flex justify-between items-center py-3 px-4 rounded-lg bg-slate-800/30 transition-all duration-200 hover:bg-slate-700/50;
}

.hd-stat-label {
  @apply text-slate-300 text-sm;
}

.hd-stat-value {
  @apply font-semibold text-slate-100;
}

/* Stats section styling */
.hd-stats-section {
  @apply bg-slate-800/20 rounded-lg p-5 border-l-4 border-blue-400;
}
</style>
