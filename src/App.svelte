<script>
  import { onMount } from 'svelte'
  import { isDarkMode, toggleTheme } from './stores/themeStore.js'
  import AudioItem from './components/AudioItem.svelte'
  import Timer from './components/Timer.svelte'
  
  let audioItems = []
  let isLoading = true
  let errorMessage = ''
  
  onMount(async () => {
    try {
      const response = await fetch('/audio-list.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      // Add IDs to the items for Svelte's each block
      audioItems = data.map((item, index) => ({
        id: index + 1,
        mp3: item.mp3,
        title: item.title
      }))
      
      isLoading = false
      
      // Initialize audio context on first user interaction
      const enableAudio = () => {
        console.log('Audio context enabled after user interaction')
        document.removeEventListener('click', enableAudio)
        document.removeEventListener('touchstart', enableAudio)
      }
      document.addEventListener('click', enableAudio, { once: true })
      document.addEventListener('touchstart', enableAudio, { once: true })
      
    } catch (error) {
      console.error('Failed to load audio list:', error)
      errorMessage = 'Failed to load audio list. Please check that audio-list.json exists and is properly formatted.'
      isLoading = false
    }
  })
</script>

<div class="app">
  <!-- Header Bar -->
  <header class="header-bar">
    <div class="header-content">
      <h1 class="app-title">🎵 Practice Timer</h1>
      <button class="theme-toggle" on:click={toggleTheme} title="Toggle dark mode">
        {#if $isDarkMode}
          ☀️ Light
        {:else}
          🌙 Dark
        {/if}
      </button>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main-content">
  <div class="audio-section">
    <div class="section-header">
      <h2>Audio Practice Items</h2>
    </div>
    
    {#if isLoading}
      <div class="loading">
        <p>Loading audio list...</p>
      </div>
    {:else if errorMessage}
      <div class="error">
        <p>{errorMessage}</p>
      </div>
    {:else}
      <div class="audio-list">
        {#each audioItems as item (item.id)}
          <AudioItem 
            itemId={item.id}
            mp3Url={item.mp3} 
            title={item.title}
          />
        {/each}
      </div>
    {/if}
  </div>
  
  <div class="timer-section">
    <Timer />
  </div>
  </main>
</div>

<style>
  .app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .header-bar {
    flex-shrink: 0;
    background-color: var(--header-bg);
    border-bottom: 2px solid var(--border-color);
    padding: 0.75rem 1rem;
    box-shadow: 0 2px 4px var(--shadow-color);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .app-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .theme-toggle {
    padding: 0.5rem 1rem;
    background-color: var(--button-bg);
    color: var(--button-text);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .theme-toggle:hover {
    background-color: var(--button-hover-bg);
    transform: translateY(-1px);
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  
  .audio-section {
    flex: 0.7;
    padding: 1rem;
    overflow-y: auto;
    border-bottom: 2px solid var(--border-color);
  }
  
  .timer-section {
    flex: 0.3;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--timer-bg);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .section-header h2 {
    margin: 0;
    color: var(--text-color) !important;
    transition: color 0.3s ease;
  }
  
  .loading, .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    text-align: center;
  }
  
  .loading p {
    color: var(--muted-text);
    font-style: italic;
  }
  
  .error p {
    color: var(--danger-color);
    background-color: var(--card-bg);
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid var(--danger-color);
  }
  
  .audio-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>