import type { WarStatus, MajorOrder, Statistics, Planet } from '@/types/helldivers2'

const API_BASE = '/api/helldivers2'

export interface DashboardData {
  warStatus: WarStatus | null
  majorOrders: MajorOrder[]
  statistics: Statistics | null
  planets: Planet[]
  lastUpdated: string
}

export class HellDivers2ApiService {
  private static async fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`)
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }
    return response.json()
  }

  static async getWarStatus(): Promise<WarStatus> {
    return this.fetchApi<WarStatus>('/war-status')
  }

  static async getMajorOrders(): Promise<MajorOrder[]> {
    return this.fetchApi<MajorOrder[]>('/major-orders')
  }

  static async getStatistics(): Promise<Statistics> {
    return this.fetchApi<Statistics>('/statistics')
  }

  static async getPlanets(): Promise<Planet[]> {
    return this.fetchApi<Planet[]>('/planets')
  }

  static async getDashboard(): Promise<DashboardData> {
    return this.fetchApi<DashboardData>('/dashboard')
  }
}
