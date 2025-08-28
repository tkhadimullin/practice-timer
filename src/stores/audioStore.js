import { writable } from 'svelte/store'

// Store to track which audio item is currently playing (by ID)
export const currentlyPlayingId = writable(null)

// Function to set the currently playing audio
export function setCurrentlyPlaying(id) {
  currentlyPlayingId.set(id)
}

// Function to stop all audio
export function stopAllAudio() {
  currentlyPlayingId.set(null)
}