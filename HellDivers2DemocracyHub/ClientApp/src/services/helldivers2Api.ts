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
    const url = `${API_BASE}${endpoint}`
    const response = await fetch(url)
    console.log('API call to:', endpoint)
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }
    const data: T = await response.json()

    // Dev-only: log raw payloads for inspection
    try {
      // Vite provides import.meta.env.DEV
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - import.meta is provided by Vite at build time
      if (import.meta && import.meta.env && import.meta.env.DEV) {
        console.groupCollapsed(`[HD2][API] ${endpoint} response`)
        if (endpoint === '/dashboard') {
          const d = data as unknown as { planets?: unknown[]; majorOrders?: unknown[]; statistics?: unknown; lastUpdated?: string }
          console.log('Summary:', {
            planets: Array.isArray(d.planets) ? d.planets.length : 0,
            majorOrders: Array.isArray(d.majorOrders) ? d.majorOrders.length : 0,
            hasStatistics: !!d.statistics,
            lastUpdated: d.lastUpdated
          })
          console.log('Full dashboard:', data)
        } else if (endpoint === '/planets') {
          const arr = data as unknown as unknown[]
          console.log('Count:', Array.isArray(arr) ? arr.length : 0)
          console.log('Planets:', data)
          console.log('Sample first planet:', Array.isArray(arr) ? arr[0] : null)
        } else if (endpoint === '/dispatches') {
          const arr = data as unknown as unknown[]
          console.log('Dispatches count:', Array.isArray(arr) ? arr.length : 0)
          if (!Array.isArray(arr)) {
            console.log('Dispatches payload (non-array):', data)
          }
        } else {
          console.log('Payload:', data)
        }
        console.groupEnd()
      }
    } catch (e) {
      // If logging fails for some reason, avoid breaking the app
      console.debug('[HD2][API] Logging skipped due to error:', e)
    }

    return data
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
      async () => {
        const raw = await this.fetchApi<any>('/dispatches')
        const arr = Array.isArray(raw)
          ? raw
          : (raw?.dispatches ?? raw?.items ?? raw?.data ?? raw?.results ?? [])

        const normalized: Dispatch[] = (Array.isArray(arr) ? arr : []).map((d: any) => ({
          id: d?.id ?? d?.Id ?? 0,
          published: typeof d?.published === 'string'
            ? d.published
            : (d?.Published ? new Date(d.Published).toISOString() : ''),
          type: d?.type ?? d?.Type ?? 0,
          message: d?.message ?? d?.Message ?? ''
        }))

        return normalized
      },
      this.CACHE_DURATIONS.dispatches
    )
  }

  static async getDashboard(): Promise<DashboardData> {
    return this.getCachedData(
      'dashboard',
      async () => {
        const raw = await this.fetchApi<any>('/dashboard')
        // Normalize PascalCase from backend to camelCase expected by the UI
        const normalized: DashboardData = {
          warStatus: raw.warStatus ?? raw.WarStatus ?? null,
          majorOrders: raw.majorOrders ?? raw.MajorOrders ?? [],
          statistics: raw.statistics ?? raw.Statistics ?? null,
          planets: raw.planets ?? raw.Planets ?? [],
          lastUpdated: raw.lastUpdated ?? raw.LastUpdated ?? new Date().toISOString(),
        }
        return normalized
      },
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
