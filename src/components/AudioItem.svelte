<script>
  import { onDestroy } from 'svelte'
  import { currentlyPlayingId, setCurrentlyPlaying } from '../stores/audioStore.js'
  
  export let itemId
  export let mp3Url = ''
  export let title = ''
  
  let audioElement
  let isPlaying = false
  let currentTime = 0
  let duration = 0
  let isDragging = false
  
  // Subscribe to the store to stop this player if another one starts
  const unsubscribe = currentlyPlayingId.subscribe(playingId => {
    if (playingId !== itemId && isPlaying && audioElement) {
      audioElement.pause()
    }
  })
  
  onDestroy(() => {
    unsubscribe()
  })
  
  async function togglePlay() {
    if (!mp3Url) {
      console.warn('No audio URL provided')
      return
    }
    
    if (!audioElement) {
      console.error('Audio element not found')
      return
    }
    
    if (isPlaying) {
      audioElement.pause()
      setCurrentlyPlaying(null)
    } else {
      try {
        setCurrentlyPlaying(itemId)
        
        // Load the audio if it's not loaded yet
        if (audioElement.readyState < 2) {
          console.log('Loading audio...')
          audioElement.load()
          await new Promise((resolve) => {
            audioElement.addEventListener('canplay', resolve, { once: true })
          })
        }
        
        console.log('Attempting to play audio...')
        const playPromise = audioElement.play()
        
        if (playPromise !== undefined) {
          await playPromise
          console.log('Audio playing successfully')
        }
      } catch (error) {
        console.error('Failed to play audio:', error.name, error.message)
        if (error.name === 'NotAllowedError') {
          alert('Audio playback was blocked by the browser. Please interact with the page first.')
        }
        setCurrentlyPlaying(null)
      }
    }
  }
  
  function handleTimeUpdate() {
    if (!isDragging) {
      currentTime = audioElement.currentTime
    }
  }
  
  function handleLoadedMetadata() {
    duration = audioElement.duration
  }
  
  function handleSeek(event) {
    if (!mp3Url || !duration) return
    
    const rect = event.target.getBoundingClientRect()
    const x = event.clientX - rect.left
    const percentage = x / rect.width
    const seekTime = percentage * duration
    
    audioElement.currentTime = seekTime
    currentTime = seekTime
  }
  

  
  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Reactive statements
  $: if (audioElement) {
    audioElement.addEventListener('play', () => isPlaying = true)
    audioElement.addEventListener('pause', () => {
      isPlaying = false
      setCurrentlyPlaying(null)
    })
    audioElement.addEventListener('ended', () => {
      isPlaying = false
      setCurrentlyPlaying(null)
    })
  }
</script>

<div class="audio-item">
  <div class="audio-player">
    <div class="player-controls">
      <button 
        class="play-btn" 
        on:click={togglePlay}
        disabled={!mp3Url}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      
      <div class="time-display">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
    
    {#if mp3Url}
      <div class="seek-bar-container">
        <div 
          class="seek-bar" 
          role="slider"
          tabindex="0"
          aria-label="Audio seek bar"
          aria-valuenow={duration ? Math.round((currentTime / duration) * 100) : 0}
          aria-valuemin="0"
          aria-valuemax="100"
          on:click={handleSeek}
          on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSeek(e);
            }
          }}
          on:mousedown={() => isDragging = true}
          on:mouseup={() => isDragging = false}
        >
          <div 
            class="seek-progress" 
            style="width: {duration ? (currentTime / duration) * 100 : 0}%"
          ></div>
        </div>
      </div>
      
      <audio
        bind:this={audioElement}
        src={mp3Url}
        on:timeupdate={handleTimeUpdate}
        on:loadedmetadata={handleLoadedMetadata}
        on:error={(e) => console.error('Audio error:', e.detail || e)}
        on:loadstart={() => console.log('Loading audio:', mp3Url)}
        on:canplay={() => console.log('Audio can play:', mp3Url)}
        preload="metadata"
      ></audio>
    {/if}
  </div>
  
  <div class="title-section">
    <h3 class="title">{title}</h3>
    {#if !mp3Url}
      <p class="no-audio">No audio file specified</p>
    {/if}
  </div>
</div>

<style>
  .audio-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background-color: var(--card-bg);
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }
  
  .audio-player {
    flex: 0 0 50%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  

  
  .player-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .play-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background-color: var(--button-bg);
    color: var(--button-text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: background-color 0.2s ease;
  }
  
  .play-btn:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
  }
  
  .play-btn:hover:not(:disabled) {
    background-color: var(--button-hover-bg);
  }
  
  .time-display {
    font-size: 0.8rem;
    color: var(--muted-text);
    min-width: 80px;
  }
  
  .seek-bar-container {
    width: 100%;
  }
  
  .seek-bar {
    width: 100%;
    height: 6px;
    background-color: var(--border-color);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
  }
  
  .seek-progress {
    height: 100%;
    background-color: var(--button-bg);
    border-radius: 3px;
    transition: width 0.1s;
  }
  
  .title-section {
    flex: 0 0 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.5rem;
  }
  
  .title {
    margin: 0 0 0.5rem 0;
    color: var(--text-color);
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.3;
  }
  
  .no-audio {
    margin: 0;
    color: var(--muted-text);
    font-style: italic;
    font-size: 0.9rem;
  }
</style>