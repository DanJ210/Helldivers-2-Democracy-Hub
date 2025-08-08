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
      <!-- War Status Card -->
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

      <!-- Statistics Card -->
      <div class="info-card statistics">
        <h2>📊 War Statistics</h2>
        <div v-if="dashboardData?.statistics" class="stats-grid">
          <div class="stat">
            <span class="label">Missions Won:</span>
            <span class="value success">{{ dashboardData.statistics.missionsWon.toLocaleString() }}</span>
          </div>
          <div class="stat">
            <span class="label">Missions Lost:</span>
            <span class="value danger">{{ dashboardData.statistics.missionsLost.toLocaleString() }}</span>
          </div>
          <div class="stat">
            <span class="label">Bug Kills:</span>
            <span class="value">{{ dashboardData.statistics.bugKills.toLocaleString() }}</span>
          </div>
          <div class="stat">
            <span class="label">Automaton Kills:</span>
            <span class="value">{{ dashboardData.statistics.automatonKills.toLocaleString() }}</span>
          </div>
          <div class="stat">
            <span class="label">Active Helldivers:</span>
            <span class="value player-count">{{ dashboardData.statistics.playerCount.toLocaleString() }}</span>
          </div>
          <div class="stat">
            <span class="label">Success Rate:</span>
            <span class="value">{{ dashboardData.statistics.missionSuccessRate }}%</span>
          </div>
        </div>
      </div>

      <!-- Major Orders Card -->
      <div class="info-card major-orders">
        <h2>🎯 Major Orders</h2>
        <div v-if="dashboardData?.majorOrders.length === 0">
          <p>No active major orders from Super Earth High Command</p>
        </div>
        <div v-else>
          <div v-for="order in dashboardData?.majorOrders" :key="order.id32" class="major-order">
            <div class="order-header">
              <span class="order-id">Order #{{ order.id32 }}</span>
              <span class="progress">{{ order.progress }}%</span>
            </div>
            <div class="expires">
              Expires: {{ formatDate(order.expiresIn) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Planet Status -->
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
import type { DashboardData, Planet } from '@/types/helldivers2'

const dashboardData = ref<DashboardData | null>(null)
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

const loadDashboard = async () => {
  try {
    loading.value = true
    error.value = null
    dashboardData.value = await HellDivers2ApiService.getDashboard()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    console.error('Failed to load dashboard:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
  
  // Auto-refresh every 5 minutes
  setInterval(() => {
    loadDashboard()
  }, 5 * 60 * 1000)
})
</script>

<style scoped>
.democracy-hub {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #ffffff;
  font-family: 'Arial', sans-serif;
}

.hub-header {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(90deg, #ff6b35, #f7931e);
  margin-bottom: 2rem;
}

.hub-header h1 {
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hub-header p {
  font-size: 1.2rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.retry-btn {
  background: #ff6b35;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.retry-btn:hover {
  background: #e55a2e;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  padding: 0 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.info-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.info-card h2 {
  margin-top: 0;
  color: #ff6b35;
  font-size: 1.4rem;
  border-bottom: 2px solid #ff6b35;
  padding-bottom: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.label {
  color: #ccc;
}

.value {
  font-weight: bold;
}

.value.success {
  color: #4ade80;
}

.value.danger {
  color: #ef4444;
}

.value.player-count {
  color: #3b82f6;
}

.major-order {
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid #ff6b35;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.order-id {
  font-weight: bold;
  color: #ff6b35;
}

.progress {
  background: #ff6b35;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.planet-list {
  max-height: 300px;
  overflow-y: auto;
}

.planet-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.planet-name {
  font-weight: bold;
  color: #ffffff;
}

.planet-info {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #ccc;
}

.hub-footer {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.hub-footer p {
  margin: 0.25rem 0;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem 1rem;
  }
  
  .hub-header h1 {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
