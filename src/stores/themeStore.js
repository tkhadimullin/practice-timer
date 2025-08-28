import { writable } from 'svelte/store'

// Storage key for theme preference
const THEME_STORAGE_KEY = 'practice-timer-theme'

// Check if we're in browser environment and get saved theme preference
function getInitialTheme() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved === 'dark' || saved === 'light') {
        const isDark = saved === 'dark'
        // Apply theme immediately to prevent flash
        document.documentElement.classList.toggle('dark-theme', isDark)
        console.log(`Loaded saved theme: ${saved}`)
        return isDark
      }
      
      // Default to system preference if no saved value
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      console.log(`Using system preference: ${systemPrefersDark ? 'dark' : 'light'}`)
      document.documentElement.classList.toggle('dark-theme', systemPrefersDark)
      
      // Save the system preference
      localStorage.setItem(THEME_STORAGE_KEY, systemPrefersDark ? 'dark' : 'light')
      
      return systemPrefersDark
    } catch (error) {
      console.warn('Failed to access localStorage for theme:', error)
      return false
    }
  }
  return false
}

// Create the theme store
export const isDarkMode = writable(getInitialTheme())

// Function to toggle theme
export function toggleTheme() {
  isDarkMode.update(current => {
    const newTheme = !current
    
    if (typeof window !== 'undefined') {
      try {
        // Save to localStorage
        localStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light')
        console.log(`Theme changed to: ${newTheme ? 'dark' : 'light'}`)
        
        // Update document class for CSS styling
        document.documentElement.classList.toggle('dark-theme', newTheme)
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error)
        // Still update the DOM class even if localStorage fails
        document.documentElement.classList.toggle('dark-theme', newTheme)
      }
    }
    
    return newTheme
  })
}

// Function to set a specific theme (useful for manual control)
export function setTheme(isDark) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark-theme', isDark)
      isDarkMode.set(isDark)
      console.log(`Theme set to: ${isDark ? 'dark' : 'light'}`)
    } catch (error) {
      console.warn('Failed to set theme:', error)
    }
  }
}

// Listen for system theme changes and update if user hasn't manually set a preference
if (typeof window !== 'undefined') {
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-update if user hasn't explicitly set a preference
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      if (!savedTheme) {
        const systemPrefersDark = e.matches
        setTheme(systemPrefersDark)
        console.log(`System theme changed to: ${systemPrefersDark ? 'dark' : 'light'}`)
      }
    })
  } catch (error) {
    console.warn('Failed to set up system theme listener:', error)
  }
  
  // Subscribe to theme changes to ensure DOM is always in sync
  isDarkMode.subscribe(dark => {
    document.documentElement.classList.toggle('dark-theme', dark)
  })
}