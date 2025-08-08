<template>
  <div class="democracy-hub">
    <header class="hub-header">
      <h1>🚀 HELLDIVERS 2 DEMOCRACY HUB 🚀</h1>
      <p>Serving Super Earth since 2184</p>
    </header>

    <div v-if="loading" class="loading">
      <p>📡 Establishing connection with Super Earth High Command...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>⚠️ Communication error with Super Earth: {{ error }}</p>
      <button @click="loadDashboard" class="retry-btn">Retry Connection</button>
    </div>

    <div v-else class="dashboard-grid">

      <!-- 1. Major Orders -->
      <div class="info-card major-orders">
        <h2>🎯 Major Orders</h2>
        <div v-if="dashboardData?.majorOrders.length === 0">
          <p>No active major orders from Super Earth High Command</p>
        </div>
        <div v-else>
          <div v-for="order in dashboardData?.majorOrders" :key="order.id" class="major-order">
            <div class="order-header">
              <div class="order-title">
                <h3>{{ order.title }}</h3>
                <span class="order-id">Order #{{ order.id }}</span>
              </div>
              <div class="order-meta">
                <div class="expiration" :class="{ 'expiring-soon': isExpiringSoon(order.expiration) }">
                  ⏰ {{ formatTimeRemaining(order.expiration) }}
                </div>
                <div v-if="order.flags" class="flags">
                  🏷️ Flags: {{ order.flags }}
                </div>
              </div>
            </div>

            <div class="order-content">
              <div class="briefing">
                <p>{{ order.briefing }}</p>
                <p v-if="order.description" class="description">{{ order.description }}</p>
              </div>

              <div class="progress-section" v-if="order.progress.length > 0">
                <h4>📈 Progress</h4>
                <div class="progress-indicators">
                  <div v-for="(value, index) in order.progress" :key="index" class="progress-item">
                    <span class="progress-label">Objective {{ index + 1 }}:</span>
                    <span class="progress-value">{{ value.toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <div class="tasks-section" v-if="order.tasks.length > 0">
                <h4>🎯 Objectives</h4>
                <div class="task-list">
                  <div v-for="(task, index) in order.tasks" :key="index" class="task-item">
                    <div class="task-header">
                      <span class="task-label">Task {{ index + 1 }}</span>
                      <span class="task-type">Type {{ task.type }}</span>
                    </div>
                    <div class="task-details" v-if="task.values.length > 0">
                      <div class="task-values">
                        <span v-for="(value, valueIndex) in task.values" :key="valueIndex" class="task-value">
                          {{ value.toLocaleString() }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rewards-section">
                <h4>🏆 Rewards</h4>
                <div v-if="order.rewards.length === 0" class="no-rewards">
                  No rewards specified
                </div>
                <div v-else class="reward-list">
                  <div v-for="(reward, index) in order.rewards" :key="index" class="reward-item">
                    <span class="reward-icon">{{ getRewardIcon(reward.type) }}</span>
                    <span class="reward-amount">{{ reward.amount.toLocaleString() }}</span>
                    <span class="reward-type">{{ getRewardTypeName(reward.type) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. High Command Dispatches -->
      <div class="info-card dispatches">
        <h2>📻 High Command Dispatches</h2>
        <div v-if="recentDispatches.length === 0" class="loading-dispatches">
          <p>📡 Connecting to High Command...</p>
        </div>
        <div v-else class="dispatch-list">
          <div v-for="dispatch in recentDispatches" :key="dispatch.id" class="dispatch-item">
            <div class="dispatch-header">
              <span class="dispatch-id">Dispatch #{{ dispatch.id }}</span>
              <span class="dispatch-date">{{ formatDate(dispatch.published) }}</span>
            </div>
            <div class="dispatch-message" v-html="dispatch.message">
            </div>
          </div>
        </div>
      </div>

      <!-- 3. War Statistics -->
      <div class="info-card statistics">
        <h2>📊 War Statistics</h2>
        <div v-if="dashboardData?.statistics" class="stats-container">
          
          <!-- Mission Statistics -->
          <div class="stats-section">
            <h3>🚀 Mission Performance</h3>
            <div class="stats-grid">
              <div class="stat">
                <span class="label">Missions Won:</span>
                <span class="value success">{{ dashboardData.statistics.missionsWon.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">Missions Lost:</span>
                <span class="value danger">{{ dashboardData.statistics.missionsLost.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">Success Rate:</span>
                <span class="value" :class="getSuccessRateClass(dashboardData.statistics.missionSuccessRate)">
                  {{ dashboardData.statistics.missionSuccessRate }}%
                </span>
              </div>
              <div class="stat">
                <span class="label">Mission Time:</span>
                <span class="value">{{ formatDuration(dashboardData.statistics.missionTime) }}</span>
              </div>
            </div>
          </div>

          <!-- Enemy Elimination Statistics -->
          <div class="stats-section">
            <h3>💀 Enemy Casualties</h3>
            <div class="stats-grid">
              <div class="stat">
                <span class="label">🐛 Terminid Kills:</span>
                <span class="value terminid">{{ dashboardData.statistics.bugKills.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">🤖 Automaton Kills:</span>
                <span class="value automaton">{{ dashboardData.statistics.automatonKills.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">👁️ Illuminate Kills:</span>
                <span class="value illuminate">{{ dashboardData.statistics.illuminateKills.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">Total Kills:</span>
                <span class="value total-kills">{{ getTotalKills(dashboardData.statistics).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Combat Statistics -->
          <div class="stats-section">
            <h3>⚔️ Combat Performance</h3>
            <div class="stats-grid">
              <div class="stat">
                <span class="label">Bullets Fired:</span>
                <span class="value">{{ dashboardData.statistics.bulletsFired.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">Bullets Hit:</span>
                <span class="value">{{ dashboardData.statistics.bulletsHit.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">Accuracy:</span>
                <span class="value" :class="getAccuracyClass(dashboardData.statistics.accuracy)">
                  {{ dashboardData.statistics.accuracy }}%
                </span>
              </div>
              <div class="stat">
                <span class="label">Friendly Fire:</span>
                <span class="value danger">{{ dashboardData.statistics.friendlies.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Helldivers Statistics -->
          <div class="stats-section">
            <h3>🪖 Helldivers Status</h3>
            <div class="stats-grid">
              <div class="stat">
                <span class="label">Active Helldivers:</span>
                <span class="value player-count pulse">{{ dashboardData.statistics.playerCount.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">Total Deaths:</span>
                <span class="value danger">{{ dashboardData.statistics.deaths.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">Revives:</span>
                <span class="value success">{{ dashboardData.statistics.revives.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">Total Playtime:</span>
                <span class="value">{{ formatDuration(dashboardData.statistics.timePlayed) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 4. Current War Status -->
      <div class="info-card war-status">
        <h2>🌍 Current War Status</h2>
        <div v-if="dashboardData?.warStatus">
          <h3>{{ dashboardData.warStatus.name }}</h3>
          <div class="stats-grid">
            <div class="stat">
              <span class="label">War Started:</span>
              <span class="value">{{ formatDate(dashboardData.warStatus.started) }}</span>
            </div>
            <div class="stat">
              <span class="label">Active Planets:</span>
              <span class="value">{{ dashboardData.planets.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 5 . Galaxy Status -->
      <div class="info-card planets">
        <h2>🌌 Galaxy Status</h2>
        <div v-if="dashboardData?.planets" class="planet-list">
          <div v-for="planet in getActivePlanets()" :key="planet.index" class="planet-item">
            <div class="planet-name">{{ planet.name }}</div>
            <div class="planet-info">
              <span class="sector">{{ planet.sector }}</span>
              <span class="health">{{ getHealthPercentage(planet) }}%</span>
            </div>
          </div>
        </div>
      </div>

    <footer class="hub-footer">
      <p>Last updated: {{ lastUpdated }}</p>
      <p>FOR DEMOCRACY! FOR SUPER EARTH!</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { HellDivers2ApiService } from '@/services/helldivers2Api'
import type { DashboardData, Planet, Dispatch } from '@/types/helldivers2'

const dashboardData = ref<DashboardData | null>(null)
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
  return statistics.bugKills + statistics.automatonKills + statistics.illuminateKills
}

const getSuccessRateClass = (successRate: number) => {
  if (successRate >= 90) return 'success'
  if (successRate >= 75) return 'warning'
  return 'danger'
}

const getAccuracyClass = (accuracy: number) => {
  if (accuracy >= 75) return 'success'
  if (accuracy >= 50) return 'warning'
  return 'danger'
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

const loadDashboard = async () => {
  try {
    loading.value = true
    error.value = null
    
    const data = await HellDivers2ApiService.getDashboard()
    dashboardData.value = data
    
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
.democracy-hub {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  min-height: 100vh;
}

.hub-header {
  text-align: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.hub-header h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #ffdd00;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.hub-header p {
  font-size: 1.2rem;
  margin: 10px 0 0 0;
  color: #cccccc;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
}

.error {
  text-align: center;
  padding: 40px;
  color: #ff6b6b;
}

.retry-btn {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.retry-btn:hover {
  background: #45b7aa;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.info-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.info-card h2 {
  margin: 0 0 15px 0;
  color: #ffdd00;
  font-size: 1.3rem;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.stats-grid {
  display: grid;
  gap: 10px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat:last-child {
  border-bottom: none;
}

.label {
  color: #cccccc;
  font-size: 0.9rem;
}

.value {
  font-weight: bold;
  font-size: 1rem;
}

.success {
  color: #4ecdc4;
}

.warning {
  color: #ffdd00;
}

.danger {
  color: #ff6b6b;
}

.terminid {
  color: #ff9800;
}

.automaton {
  color: #f44336;
}

.illuminate {
  color: #9c27b0;
}

.total-kills {
  color: #4caf50;
  font-size: 1.1rem;
}

.player-count {
  color: #2196f3;
  font-size: 1.1rem;
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-section {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 15px;
  border-left: 4px solid #ffdd00;
}

.stats-section h3 {
  margin: 0 0 15px 0;
  color: #ffdd00;
  font-size: 1.1rem;
}

.planet-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.planet-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #4ecdc4;
}

.planet-name {
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 5px;
}

.planet-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #cccccc;
}

.major-order {
  background: rgba(255, 221, 0, 0.1);
  border: 1px solid rgba(255, 221, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.order-title h3 {
  margin: 0;
  color: #ffdd00;
  font-size: 1.1rem;
}

.order-id {
  background: rgba(255, 221, 0, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #ffdd00;
  margin-top: 5px;
  display: inline-block;
}

.order-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.expiration {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 0.8rem;
}

.expiring-soon {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.flags {
  font-size: 0.8rem;
  color: #cccccc;
}

.order-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.briefing p {
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.description {
  color: #cccccc;
  font-style: italic;
}

.progress-section, .tasks-section, .rewards-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 8px;
}

.progress-section h4, .tasks-section h4, .rewards-section h4 {
  margin: 0 0 10px 0;
  color: #4ecdc4;
  font-size: 1rem;
}

.progress-indicators, .task-list, .reward-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-item, .reward-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 12px;
  border-radius: 5px;
}

.task-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 10px 12px;
  border-radius: 5px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-label {
  font-weight: bold;
  color: #4ecdc4;
}

.task-type {
  font-size: 0.8rem;
  color: #cccccc;
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 3px;
}

.task-values {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.task-value {
  background: rgba(255, 221, 0, 0.2);
  color: #ffdd00;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.85rem;
}

.no-rewards {
  color: #cccccc;
  font-style: italic;
  text-align: center;
  padding: 10px;
}

.reward-icon {
  font-size: 1.2rem;
}

.reward-amount {
  font-weight: bold;
  color: #4caf50;
}

.reward-type {
  color: #cccccc;
  font-size: 0.9rem;
}

.dispatch-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dispatch-item {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  padding: 12px;
}

.dispatch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 10px;
}

.dispatch-id {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.dispatch-date {
  color: #cccccc;
  font-size: 0.85rem;
}

.dispatch-message {
  line-height: 1.5;
  color: #ffffff;
}

.loading-dispatches {
  text-align: center;
  color: #cccccc;
  font-style: italic;
  padding: 20px;
}

.hub-footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: #cccccc;
}

.hub-footer p {
  margin: 5px 0;
}
</style>
