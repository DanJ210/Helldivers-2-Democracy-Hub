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
          <div v-for="planet in getActivePlanets()" :key="planet.index" class="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div class="flex justify-between items-start">
              <div>
                <div class="font-semibold text-slate-100 flex items-center gap-2">
                  <span>{{ planet.name }}</span>
                  <span v-if="getPlanetPlayerCount(planet) > 0" class="inline-flex items-center gap-1 text-xs text-green-300" :title="getPlanetPlayerTooltip(planet)">
                    <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true"></span>
                    <span class="sr-only">Players online</span>
                  </span>
                  <span v-if="isUnderAttack(planet)" class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border bg-red-500/20 text-red-300 border-red-500/30" :title="'Attackers: ' + getAttackerFactions(planet).join(', ')">
                    🔥 Under attack
                  </span>
                </div>
                <div class="text-sm text-slate-400">{{ planet.sector }} • {{ planet.biome?.name || 'Unknown Biome' }}</div>
                <div v-if="planet.hazards?.length" class="mt-1 flex flex-wrap gap-1">
                  <span
                    v-for="hz in mapHazards(planet.hazards)"
                    :key="hz.key + '-' + (hz.extra || '')"
                    class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border"
                    :class="hz.color"
                    :title="hz.tooltip || hz.label"
                  >
                    <span aria-hidden="true">{{ hz.icon }}</span>
                    <span>{{ hz.label }}</span>
                    <span v-if="hz.extra" class="opacity-75">({{ hz.extra }})</span>
                  </span>
                </div>
                <div class="mt-2 flex items-center gap-2 text-xs text-slate-300">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                        :title="getPlanetPlayerTooltip(planet)"
                        role="button"
                        tabindex="0"
                        @click="togglePlanetStats(planet.index)"
                        @keydown.enter.prevent="togglePlanetStats(planet.index)"
                        @keydown.space.prevent="togglePlanetStats(planet.index)">
                    👥 {{ getPlanetPlayerCount(planet).toLocaleString() }}
                  </span>
                  <div class="relative inline-block">
                    <button class="hd-stats-toggle px-2 py-0.5 rounded border border-slate-600 hover:bg-slate-700/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition text-slate-200 flex items-center gap-1"
                            @click="togglePlanetStats(planet.index)"
                            :aria-expanded="isPlanetStatsOpen(planet.index)"
                            :aria-controls="`stats-popover-${planet.index}`"
                            :title="isPlanetStatsOpen(planet.index) ? 'Hide planet statistics' : 'Show planet statistics'">
                      📊 Stats
                      <span aria-hidden="true">{{ isPlanetStatsOpen(planet.index) ? '▾' : '▸' }}</span>
                    </button>
                    <div v-if="isPlanetStatsOpen(planet.index)" :id="`stats-popover-${planet.index}`" role="dialog" :aria-label="`Planet stats for ${planet.name}`"
                         class="hd-stats-popover absolute left-0 mt-2 z-50 w-72 p-3 rounded-lg border border-slate-700 bg-slate-900/95 shadow-xl backdrop-blur-sm">
                      <div class="text-slate-400 text-xs uppercase tracking-wide mb-2">Planet Stats</div>
                      <ul class="space-y-1 text-slate-200">
                        <li class="flex justify-between"><span>Players</span><span class="font-mono">{{ getPlanetPlayerCount(planet).toLocaleString() }}</span></li>
                        <li class="flex justify-between"><span>Health</span><span class="font-mono">{{ getHealthPercentage(planet) }}% ({{ planet.health.toLocaleString() }} / {{ planet.maxHealth.toLocaleString() }})</span></li>
                        <li class="flex justify-between"><span>Regen/s</span><span class="font-mono">+{{ getTotalRegen(planet).toLocaleString() }}</span></li>
                        <li class="flex justify-between"><span>Owner</span><span class="font-mono">{{ getFactionName(planet.currentOwner) }}</span></li>
                        <li class="flex justify-between"><span>Coords</span><span class="font-mono">{{ planet.position.x }}, {{ planet.position.y }}</span></li>
                      </ul>
                      <div class="text-slate-400 text-xs uppercase tracking-wide mt-3 mb-1">Regions</div>
                      <div v-if="planet.regions?.length" class="max-h-40 overflow-auto pr-1">
                        <ul class="space-y-1">
                          <li v-for="r in planet.regions" :key="r.id" class="flex justify-between text-slate-300">
                            <span class="truncate" :title="r.name || ('Region ' + r.id)">{{ r.name || ('Region ' + r.id) }}</span>
                            <span class="font-mono">👥 {{ (r.players || 0).toLocaleString() }}</span>
                          </li>
                        </ul>
                      </div>
                      <div v-else class="text-slate-500">No region data</div>
                    </div>
                  </div>
                </div>
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
                <div class="text-xs text-slate-400">
                  {{ planet.health.toLocaleString() }} / {{ planet.maxHealth.toLocaleString() }}
                </div>
       <div class="mt-2 w-32 h-1.5 bg-slate-700 rounded overflow-hidden" role="progressbar"
         :aria-valuenow="getHealthPercentage(planet)" aria-valuemin="0" aria-valuemax="100"
         :aria-label="`Health of ${planet.name}`">
         <div class="h-full transition-all duration-300" :class="getHealthBarColorClass(getHealthPercentage(planet))"
           :style="{ width: getHealthPercentage(planet) + '%' }"></div>
       </div>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div>
                <div>Owner: <span class="font-semibold">{{ getOwnerLabel(planet.currentOwner) }}</span></div>
                <div class="text-xs text-slate-400">Initial: {{ getOwnerLabel(planet.initialOwner) }}</div>
              </div>
              <div class="text-right">
                <div>Coords: <span class="font-mono">{{ planet.position?.x ?? '-' }}, {{ planet.position?.y ?? '-' }}</span></div>
                <div class="text-xs text-slate-400">Waypoints: {{ planet.waypoints?.length || 0 }}</div>
              </div>
            </div>

            <div v-if="(planet.regenPerSecond?.length || 0) > 0" class="mt-2 text-xs text-slate-400">
              Regen: +{{ getTotalRegen(planet).toLocaleString() }}/s
            </div>

            <div v-if="planet.event?.length" class="mt-3">
              <div class="text-xs uppercase tracking-wide text-slate-400 mb-1">Active Events</div>
              <div class="space-y-1">
                <div v-for="ev in planet.event" :key="ev.id" class="flex justify-between items-center text-sm bg-slate-900/40 rounded p-2 border border-slate-700/50">
                  <div>
                    <div class="font-medium">Event {{ ev.eventType }}</div>
                    <div class="text-xs text-slate-400">Faction: {{ getFactionName(ev.faction) }}</div>
                  </div>
                  <div class="text-right text-xs text-slate-400">
                    Ends in: {{ formatTimeRemaining(ev.endTime) }}
                  </div>
                </div>
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { HellDivers2ApiService } from '@/services/helldivers2Api'
import { majorOrderInterpreter, type MajorOrderInterpretation } from '@/services/majorOrderInterpreter'
import type { DashboardData, Planet, Dispatch } from '@/types/helldivers2'
import { FACTIONS } from '@/types/helldivers2'

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

const getFactionName = (factionIndex: number) => {
  switch (factionIndex) {
    case FACTIONS.SUPER_EARTH: return 'Super Earth'
    case FACTIONS.TERMINIDS: return 'Terminids'
    case FACTIONS.AUTOMATONS: return 'Automatons'
    case FACTIONS.ILLUMINATE: return 'Illuminate'
    default: return `Faction ${factionIndex}`
  }
}

// Owner label helper: accepts numeric or string owner values
const getOwnerLabel = (owner: number | string) => {
  if (typeof owner === 'string') return owner
  return getFactionName(owner)
}

const getTotalRegen = (planet: Planet) => {
  const rp: any = (planet as any).regenPerSecond
  if (Array.isArray(rp)) {
    return rp.reduce((sum: number, r: any) => sum + (typeof r === 'number' ? r : (r?.value ?? 0)), 0)
  }
  if (typeof rp === 'number') return rp
  if (rp && typeof rp === 'object' && typeof rp.value === 'number') return rp.value
  return 0
}

// Player count helpers
const getPlanetPlayersDirect = (planet: Planet): number | null => {
  const direct = (planet as any).statistics?.players
  return typeof direct === 'number' && isFinite(direct) ? direct : null
}
const getPlanetPlayersFromRegions = (planet: Planet): number => {
  const regions = (planet as any).regions as Array<{ players?: number }> | undefined
  if (Array.isArray(regions)) return regions.reduce((sum, r) => sum + (r.players || 0), 0)
  return 0
}
const getPlanetPlayerCount = (planet: Planet): number => {
  const direct = getPlanetPlayersDirect(planet)
  if (direct !== null) return direct
  return getPlanetPlayersFromRegions(planet)
}
const getPlanetPlayerTooltip = (planet: Planet): string => {
  const direct = getPlanetPlayersDirect(planet)
  const sum = getPlanetPlayersFromRegions(planet)
  if (direct !== null && sum > 0 && sum !== direct) {
    return `Players: ${direct.toLocaleString()} (planet) | ${sum.toLocaleString()} (regions sum)`
  }
  if (direct !== null) return `Players: ${direct.toLocaleString()} (planet statistics)`
  if (sum > 0) return `Players: ${sum.toLocaleString()} (sum of regions)`
  return 'No active players detected'
}

// UI toggle state for per-planet stats panel
const openPlanetStats = ref<Record<number, boolean>>({})
const togglePlanetStats = (index: number) => {
  openPlanetStats.value[index] = !openPlanetStats.value[index]
}
const isPlanetStatsOpen = (index: number) => !!openPlanetStats.value[index]

// Close popovers on outside click or Escape
const handleDocumentClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement | null
  if (!target) return
  const insidePopover = target.closest('.hd-stats-popover')
  const onToggle = target.closest('.hd-stats-toggle')
  if (!insidePopover && !onToggle) {
    openPlanetStats.value = {}
  }
}
const handleDocumentKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    openPlanetStats.value = {}
  }
}
onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleDocumentKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleDocumentKeydown)
})

// Attack helpers
const isEventActive = (ev: { endTime: string }) => {
  const now = Date.now()
  const end = new Date(ev.endTime).getTime()
  return isFinite(end) ? end > now : true
}

const isUnderAttack = (planet: Planet) => {
  const raw = (planet as any).event
  const events: Array<{ endTime: string }> = Array.isArray(raw) ? raw : (raw ? [raw] : [])
  return events.some(isEventActive)
}

const getAttackerFactions = (planet: Planet): string[] => {
  const raw = (planet as any).event
  const events: Array<{ faction: number; endTime: string }> = Array.isArray(raw) ? raw : (raw ? [raw] : [])
  const active = events.filter(isEventActive)
  const names = active.map(ev => getFactionName(ev.faction))
  // de-dupe while preserving order
  return names.filter((n, i) => names.indexOf(n) === i)
}

// Map and format hazards. The API sometimes returns plain strings or JSON-like strings.
type HazardChip = { key: string; label: string; icon: string; color: string; tooltip?: string; extra?: string }
const HAZARD_MAP: Record<string, Omit<HazardChip, 'key'>> = {
  // Common hazards with friendly names and icons
  'volcanic activity': { label: 'Volcanic', icon: '🌋', color: 'bg-red-500/20 text-red-300 border-red-500/30', tooltip: 'Volcanic eruptions and lava flows' },
  'blizzards': { label: 'Blizzards', icon: '❄️', color: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30', tooltip: 'Severe snowstorms reduce visibility' },
  'sandstorms': { label: 'Sandstorms', icon: '🌪️', color: 'bg-amber-500/20 text-amber-200 border-amber-500/30', tooltip: 'Sand reduces accuracy and vision' },
  'electrical storms': { label: 'Electro-Storms', icon: '⚡', color: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30', tooltip: 'Lightning hazards' },
  'meteor storms': { label: 'Meteors', icon: '☄️', color: 'bg-orange-500/20 text-orange-200 border-orange-500/30', tooltip: 'Falling meteors impact the battlefield' },
  'hellpods interference': { label: 'Drop Interference', icon: '🛰️', color: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/30', tooltip: 'Hellpod drop disruptions' },
  'thick fog': { label: 'Thick Fog', icon: '🌫️', color: 'bg-slate-500/20 text-slate-200 border-slate-500/30', tooltip: 'Reduced visibility' },
  'radioactive': { label: 'Radiation', icon: '☢️', color: 'bg-lime-500/20 text-lime-200 border-lime-500/30', tooltip: 'Radioactive contamination' },
}

const normalizeHazardKey = (raw: string) => raw.trim().toLowerCase()

const tryParseJson = (value: string): any | null => {
  try {
    const parsed = JSON.parse(value)
    // Accept only objects with a name field or arrays with first element object/string
    return parsed
  } catch {
    return null
  }
}

const mapHazards = (hazards: Array<string | Record<string, any>>): HazardChip[] => {
  const chips: HazardChip[] = []
  for (const h of hazards) {
    let label: string | undefined
    let extra: string | undefined
    let tooltip: string | undefined

    // The API may return:
    // 1) plain string ("Volcanic Activity")
    // 2) JSON string ("{\"name\":...}")
    // 3) object ({ name, severity, level, description })
    if (typeof h === 'string') {
      const maybe = tryParseJson(h)
      if (maybe && typeof maybe === 'object') {
        if (typeof maybe.name === 'string') label = maybe.name
        if (maybe.severity !== undefined) extra = `S${maybe.severity}`
        if (maybe.level !== undefined && !extra) extra = `L${maybe.level}`
        if (typeof maybe.description === 'string') tooltip = maybe.description
      } else {
        label = h
      }
    } else if (h && typeof h === 'object') {
      if (typeof h.name === 'string') label = h.name
      if (h.severity !== undefined) extra = `S${h.severity}`
      if (h.level !== undefined && !extra) extra = `L${h.level}`
      if (typeof h.description === 'string') tooltip = h.description
    }

    const safeLabel = label ?? 'Hazard'
    const key = normalizeHazardKey(safeLabel)
    const mapped = HAZARD_MAP[key]
    if (mapped) {
      chips.push({ key, label: mapped.label, icon: mapped.icon, color: mapped.color, tooltip: tooltip || mapped.tooltip, extra })
    } else {
      // Fallback: generic chip
      chips.push({ key, label: safeLabel, icon: '⚠️', color: 'bg-slate-700 text-slate-200 border-slate-500/40', tooltip, extra })
    }
  }
  return chips
}

const getActivePlanets = () => {
  if (!dashboardData.value?.planets) return []
  return dashboardData.value.planets
    .filter((planet: Planet) => !planet.disabled)
    .slice()
    .sort((a: Planet, b: Planet) => {
      const pa = getPlanetPlayerCount(a) > 0 ? 1 : 0
      const pb = getPlanetPlayerCount(b) > 0 ? 1 : 0
      if (pa !== pb) return pb - pa // planets with players first

      const ua = isUnderAttack(a) ? 1 : 0
      const ub = isUnderAttack(b) ? 1 : 0
      if (ua !== ub) return ub - ua // among same player presence, attacked first

      const aPct = getHealthPercentage(a)
      const bPct = getHealthPercentage(b)
      if (aPct !== bPct) return aPct - bPct // lowest health first

      return a.name.localeCompare(b.name)
    })
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

const getHealthBarColorClass = (pct: number) => {
  if (pct > 75) return 'bg-green-500'
  if (pct > 50) return 'bg-yellow-400'
  if (pct > 25) return 'bg-orange-400'
  return 'bg-red-500'
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
    
  // Debug: inspect planet data returned from the API
  console.groupCollapsed('[HD2] Planets payload')
  console.log('Count:', data.planets?.length ?? 0)
  console.log('Planets:', data.planets)
  console.log('Sample first planet:', data.planets?.[0])
  console.groupEnd()

    // Debug: summarize attacking factions via active events on planets
    try {
      const planets = Array.isArray(data.planets) ? data.planets : []
      const withEvents = planets.filter(p => Array.isArray(p.event) && p.event.length > 0)
      console.groupCollapsed('[HD2] Attacking factions summary')
      console.log('Planets with active events:', withEvents.length)
      withEvents.forEach(p => {
        const attackers = p.event.map(ev => ({ faction: ev.faction, eventType: ev.eventType, until: ev.endTime }))
        const attackerNames = attackers.map(a => getFactionName(a.faction))
        console.log(`- ${p.name} (owner: ${getFactionName(p.currentOwner)})`, attackers, `attackers: ${[...new Set(attackerNames)].join(', ')}`)
      })
      console.groupEnd()
    } catch (e) {
      console.debug('[HD2] Attack summary logging skipped:', e)
    }
    
    // Update the interpreter with current planet data
    if (data.planets.length > 0) {
      majorOrderInterpreter.updatePlanets(data.planets)
    }
    
    // Interpret major orders for better display
    interpretedMajorOrders.value = majorOrderInterpreter.interpretMajorOrders(data.majorOrders)
    
    let dispatches = await HellDivers2ApiService.getDispatches()
    if (!dispatches || dispatches.length === 0) {
      // Cache-bypass retry once in case of stale/empty cache
      HellDivers2ApiService.forceRefresh('dispatches')
      dispatches = await HellDivers2ApiService.getDispatches()
    }
    recentDispatches.value = (dispatches || []).slice(0, 3)
    
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
