<script>
  import { onMount, onDestroy } from 'svelte'
  
  let totalSeconds = 0
  let isRunning = false
  let intervalId = null
  let isInitialized = false
  
  // Load saved timer state immediately (synchronously)
  if (typeof window !== 'undefined') {
    try {
      const savedTime = localStorage.getItem('practice-timer-seconds')
      if (savedTime) {
        const parsed = parseInt(savedTime, 10)
        if (!isNaN(parsed) && parsed >= 0) {
          totalSeconds = parsed
          console.log(`Loaded saved timer: ${parsed} seconds`)
        }
      }
    } catch (error) {
      console.warn('Failed to load timer from localStorage:', error)
    }
  }
  
  onMount(() => {
    // Mark as initialized to enable auto-saving
    isInitialized = true
    console.log(`Timer initialized with ${totalSeconds} seconds`)
  })
  
  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })
  
  function startStop() {
    if (isRunning) {
      // Stop timer
      clearInterval(intervalId)
      intervalId = null
    } else {
      // Start timer
      intervalId = setInterval(() => {
        totalSeconds += 1
        saveToLocalStorage()
      }, 1000)
    }
    isRunning = !isRunning
  }
  
  function reset() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning = false
    totalSeconds = 0
    saveToLocalStorage()
  }
  
  function saveToLocalStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('practice-timer-seconds', totalSeconds.toString())
        console.log(`Timer saved: ${totalSeconds} seconds`)
      } catch (error) {
        console.warn('Failed to save timer to localStorage:', error)
      }
    }
  }
  
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
  
  // Save to localStorage whenever totalSeconds changes (only after initialization)
  $: if (isInitialized && typeof totalSeconds === 'number') {
    saveToLocalStorage()
  }
</script>

<div class="timer">
  <h2>Practice Timer</h2>
  
  <div class="time-display">
    {formatTime(totalSeconds)}
  </div>
  
  <div class="timer-controls">
    <button 
      class="control-btn start-stop-btn" 
      class:running={isRunning}
      on:click={startStop}
    >
      {isRunning ? '⏸️ Pause' : '▶️ Start'}
    </button>
    
    <button 
      class="control-btn reset-btn" 
      on:click={reset}
    >
      🔄 Reset
    </button>
  </div>
  
  <div class="timer-info">
    <p class="status">
      Status: <span class="status-text" class:running={isRunning}>
        {isRunning ? 'Running' : 'Stopped'}
      </span>
    </p>
    <p class="save-info">Timer automatically saves your progress</p>
  </div>
</div>

<style>
  .timer {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    max-width: 400px;
  }
  
  .timer h2 {
    margin: 0 0 1rem 0;
    color: var(--text-color);
  }
  
  .time-display {
    font-size: 3rem;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    color: var(--button-bg);
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: var(--card-bg);
    border-radius: 12px;
    border: 2px solid var(--border-color);
    min-width: 200px;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }
  
  .timer-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .control-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
  }
  
  .start-stop-btn {
    background-color: var(--success-color);
    color: var(--button-text);
  }
  
  .start-stop-btn.running {
    background-color: var(--warning-color);
    color: var(--text-color);
  }
  
  .start-stop-btn:hover {
    transform: translateY(-1px);
  }
  
  .start-stop-btn:hover:not(.running) {
    background-color: var(--success-color);
    filter: brightness(0.9);
  }
  
  .start-stop-btn.running:hover {
    background-color: var(--warning-color);
    filter: brightness(0.9);
  }
  
  .reset-btn {
    background-color: var(--border-color);
    color: var(--text-color);
  }
  
  .reset-btn:hover {
    background-color: var(--border-color);
    filter: brightness(0.8);
    transform: translateY(-1px);
  }
  
  .timer-info {
    text-align: center;
  }
  
  .timer-info p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: var(--muted-text);
  }
  
  .status-text {
    font-weight: bold;
  }
  
  .status-text.running {
    color: var(--success-color);
  }
  
  .save-info {
    font-style: italic;
    font-size: 0.8rem !important;
  }
</style>