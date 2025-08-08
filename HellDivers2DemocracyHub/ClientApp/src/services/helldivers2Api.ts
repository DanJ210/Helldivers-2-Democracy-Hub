import type { WarStatus, MajorOrder, Statistics, Planet, Dispatch } from '@/types/helldivers2'
import { CacheService } from './cacheService'

const API_BASE = '/api/helldivers2'

export interface DashboardData {
  warStatus: WarStatus | null
  majorOrders: MajorOrder[]
  statistics: Statistics | null
  planets: Planet[]
  lastUpdated: string
}

export class HellDivers2ApiService {
  // Cache durations in milliseconds
  private static readonly CACHE_DURATIONS = {
    dashboard: 5 * 60 * 1000,    // 5 minutes for main dashboard
    warStatus: 10 * 60 * 1000,   // 10 minutes for war status
    majorOrders: 5 * 60 * 1000,  // 5 minutes for major orders (can change frequently)
    statistics: 2 * 60 * 1000,   // 2 minutes for statistics (updates frequently)
    planets: 15 * 60 * 1000,     // 15 minutes for planets (relatively stable)
    dispatches: 30 * 60 * 1000,  // 30 minutes for dispatches (less frequent updates)
  }

  private static async fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`)
    console.log('API call to:', endpoint)
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }
    return response.json()
  }

  private static async getCachedData<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    duration: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = CacheService.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Cache miss - fetch fresh data
    console.log(`Fetching fresh data for: ${key}`)
    const data = await fetcher()
    
    // Cache the result
    CacheService.set(key, data, { duration })
    return data
  }

  static async getWarStatus(): Promise<WarStatus> {
    return this.getCachedData(
      'war-status',
      () => this.fetchApi<WarStatus>('/war-status'),
      this.CACHE_DURATIONS.warStatus
    )
  }

  static async getMajorOrders(): Promise<MajorOrder[]> {
    return this.getCachedData(
      'major-orders',
      () => this.fetchApi<MajorOrder[]>('/major-orders'),
      this.CACHE_DURATIONS.majorOrders
    )
  }

  static async getStatistics(): Promise<Statistics> {
    return this.getCachedData(
      'statistics',
      () => this.fetchApi<Statistics>('/statistics'),
      this.CACHE_DURATIONS.statistics
    )
  }

  static async getPlanets(): Promise<Planet[]> {
    return this.getCachedData(
      'planets',
      () => this.fetchApi<Planet[]>('/planets'),
      this.CACHE_DURATIONS.planets
    )
  }

  static async getDispatches(): Promise<Dispatch[]> {
    return this.getCachedData(
      'dispatches',
      () => this.fetchApi<Dispatch[]>('/dispatches'),
      this.CACHE_DURATIONS.dispatches
    )
  }

  static async getDashboard(): Promise<DashboardData> {
    return this.getCachedData(
      'dashboard',
      () => this.fetchApi<DashboardData>('/dashboard'),
      this.CACHE_DURATIONS.dashboard
    )
  }

  /**
   * Force refresh specific data by clearing its cache
   */
  static forceRefresh(dataType?: keyof typeof this.CACHE_DURATIONS): void {
    if (dataType) {
      CacheService.remove(dataType)
      console.log(`Forced refresh for: ${dataType}`)
    } else {
      CacheService.clear()
      console.log('Forced refresh for all data')
    }
  }

  /**
   * Get cache information for debugging
   */
  static getCacheInfo() {
    return CacheService.getInfo()
  }
}
