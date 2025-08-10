// Helldivers 2 Democracy Hub - Tailwind CSS Utility Classes
// Common class combinations for consistent styling

export const HelldiverStyles = {
  // Layout
  container: 'container mx-auto px-4',
  section: 'py-8 px-4',
  
  // Cards
  card: 'hd-card',
  cardHeader: 'hd-card-header',
  cardContent: 'p-6',
  
  // Buttons
  buttons: {
    primary: 'hd-button-primary',
    secondary: 'hd-button-secondary', 
    danger: 'hd-button-danger',
    small: 'px-2 py-1 text-sm',
    large: 'px-6 py-3 text-lg'
  },
  
  // Status indicators
  status: {
    active: 'hd-status-active',
    warning: 'hd-status-warning',
    danger: 'hd-status-danger',
    info: 'hd-status-info'
  },
  
  // Typography
  text: {
    heading1: 'hd-heading-1',
    heading2: 'hd-heading-2', 
    heading3: 'hd-heading-3',
    body: 'hd-text-body',
    caption: 'hd-text-caption'
  },
  
  // Grids
  grid: {
    dashboard: 'hd-dashboard-grid',
    dashboardWide: 'hd-dashboard-grid-wide',
    simple: 'grid gap-4'
  },
  
  // Animations
  animations: {
    pulse: 'hd-pulse',
    fadeIn: 'hd-fade-in',
    hover: 'transition-transform duration-200 hover:scale-105'
  },
  
  // Gaming effects
  effects: {
    glow: 'hd-glow',
    glowYellow: 'hd-glow-yellow',
    glowRed: 'hd-glow-red',
    glowGreen: 'hd-glow-green'
  },
  
  // Progress bars
  progress: {
    bar: 'hd-progress-bar',
    fill: 'hd-progress-fill'
  }
} as const

// Helper function for conditional status classes
export function getStatusClass(
  condition: 'success' | 'warning' | 'danger' | 'info' | boolean,
  baseClass = ''
): string {
  const statusMap = {
    success: HelldiverStyles.status.active,
    warning: HelldiverStyles.status.warning, 
    danger: HelldiverStyles.status.danger,
    info: HelldiverStyles.status.info,
    true: HelldiverStyles.status.active,
    false: HelldiverStyles.status.info
  }
  
  const statusClass = statusMap[condition as keyof typeof statusMap] || HelldiverStyles.status.info
  return baseClass ? `${baseClass} ${statusClass}` : statusClass
}

// Helper for completion percentage styling
export function getCompletionClass(percentage: number): string {
  if (percentage >= 80) return HelldiverStyles.status.active
  if (percentage >= 50) return HelldiverStyles.status.warning
  return HelldiverStyles.status.danger
}

// Helper for responsive grid columns
export function getGridCols(items: number): string {
  if (items <= 1) return 'grid-cols-1'
  if (items <= 2) return 'grid-cols-1 md:grid-cols-2'
  if (items <= 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
}

// Helldivers 2 theme colors for dynamic styling
export const HelldiverColors = {
  primary: {
    blue: '#1e40af',
    yellow: '#eab308'
  },
  status: {
    success: '#16a34a',
    warning: '#ea580c', 
    danger: '#dc2626',
    info: '#3b82f6'
  },
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155'
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    muted: '#64748b'
  }
} as const
