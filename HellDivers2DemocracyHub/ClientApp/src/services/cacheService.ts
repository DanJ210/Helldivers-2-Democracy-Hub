interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface CacheOptions {
  /** Cache duration in milliseconds. Default: 5 minutes (300000ms) */
  duration?: number
  /** Whether to use localStorage for persistence across sessions. Default: true */
  persistent?: boolean
}

export class CacheService {
  private static cache = new Map<string, CacheEntry<any>>()
  private static readonly DEFAULT_DURATION = 5 * 60 * 1000 // 5 minutes
  private static readonly STORAGE_KEY = 'helldivers2_cache'

  /**
   * Initialize cache from localStorage if available
   */
  static init() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY)
        if (stored) {
          const parsedCache = JSON.parse(stored)
          // Convert the stored object back to a Map
          this.cache = new Map(Object.entries(parsedCache))
        }
      } catch (error) {
        console.warn('Failed to load cache from localStorage:', error)
      }
    }
  }

  /**
   * Save cache to localStorage
   */
  private static saveToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        // Convert Map to object for JSON serialization
        const cacheObject = Object.fromEntries(this.cache)
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheObject))
      } catch (error) {
        console.warn('Failed to save cache to localStorage:', error)
      }
    }
  }

  /**
   * Check if a cache entry is valid (not expired)
   */
  private static isValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() < entry.expiresAt
  }

  /**
   * Get data from cache if valid, otherwise return null
   */
  static get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) {
      return null
    }

    if (this.isValid(entry)) {
      console.log(`Cache HIT for key: ${key}`)
      return entry.data as T
    } else {
      // Remove expired entry
      this.cache.delete(key)
      this.saveToStorage()
      console.log(`Cache EXPIRED for key: ${key}`)
      return null
    }
  }

  /**
   * Set data in cache with expiration
   */
  static set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const { duration = this.DEFAULT_DURATION, persistent = true } = options
    const now = Date.now()

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + duration
    }

    this.cache.set(key, entry)
    console.log(`Cache SET for key: ${key}, expires in ${duration / 1000}s`)

    if (persistent) {
      this.saveToStorage()
    }
  }

  /**
   * Remove a specific cache entry
   */
  static remove(key: string): boolean {
    const removed = this.cache.delete(key)
    if (removed) {
      this.saveToStorage()
      console.log(`Cache REMOVED for key: ${key}`)
    }
    return removed
  }

  /**
   * Clear all cache entries
   */
  static clear(): void {
    this.cache.clear()
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.STORAGE_KEY)
    }
    console.log('Cache CLEARED')
  }

  /**
   * Get cache info for debugging
   */
  static getInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }

  /**
   * Remove expired entries (cleanup)
   */
  static cleanup(): number {
    let removedCount = 0
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key)
        removedCount++
      }
    }

    if (removedCount > 0) {
      this.saveToStorage()
      console.log(`Cache CLEANUP: removed ${removedCount} expired entries`)
    }

    return removedCount
  }
}

// Initialize cache when module loads
CacheService.init()

// Optional: Run cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    CacheService.cleanup()
  }, 10 * 60 * 1000) // 10 minutes
}
