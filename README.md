# Practice Timer

A simple, single-page web application for practicing with audio files and tracking time. Built with Svelte for simplicity and efficiency.

## Features

- **Audio Practice List (Top 70%)**:
  - Upload and play audio files
  - Simple play/pause controls with seek bar
  - Free text notes for each audio item
  - Add/remove audio items dynamically

- **Practice Timer (Bottom 30%)**:
  - Start/pause/reset functionality
  - Automatic save to localStorage (persists between sessions)
  - Clean, readable time display (MM:SS or HH:MM:SS)

- **Dark/Light Theme Toggle**:
  - Header bar with theme switcher
  - Automatic localStorage persistence (remembers your choice)
  - System theme detection as fallback
  - Smooth transitions between themes
  - No theme flash on page load

## Quick Start

### Using Docker (Recommended)

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the app:**
   Open your browser to `http://localhost:3000`

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the app:**
   Open your browser to `http://localhost:5173`

## Usage

1. **Audio Practice**:
   - Click "Add Item" to create new audio items
   - Use the file input to upload audio files (MP3, WAV, etc.)
   - Add notes in the text area for each audio item
   - Use the play button and seek bar to control playback
   - Click the ✕ button to remove items

2. **Timer**:
   - Click "Start" to begin timing your practice session
   - Click "Pause" to pause the timer
   - Click "Reset" to reset the timer to 00:00
   - Your timer progress is automatically saved and will persist when you refresh the page

## Project Structure

```
practice-timer/
├── src/
│   ├── components/
│   │   ├── AudioItem.svelte    # Individual audio player component
│   │   └── Timer.svelte        # Timer component with localStorage
│   ├── App.svelte             # Main app with 70/30 layout
│   ├── main.js                # Entry point
│   └── app.css                # Global styles
├── Dockerfile                 # Production build
├── docker-compose.yml         # Easy deployment
├── nginx.conf                 # Nginx configuration
└── package.json              # Dependencies and scripts
```

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build

## Docker Deployment

### Using Docker Hub (Automated)

This project includes GitHub Actions CI/CD that automatically builds and pushes Docker images to Docker Hub.

**GitHub Repository Secrets Required:**
- `DOCKER_HUB_USERNAME` - Your Docker Hub username
- `DOCKER_HUB_ACCESS_TOKEN` - Docker Hub access token (create at hub.docker.com/settings/security)

**Images are automatically published:**
- On pushes to `main`/`master` branch: `username/practice-timer:main`
- On version tags: `username/practice-timer:v1.0.0`

**Pull and run from Docker Hub:**
```bash
docker pull yourusername/practice-timer:latest
docker run -p 3000:80 yourusername/practice-timer:latest
```

### Local Docker Build

**Build locally:**
```bash
docker build -t practice-timer .
docker run -p 3000:80 practice-timer
```

**Using Docker Compose:**
```bash
docker-compose up --build
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Audio file support depends on browser (MP3, WAV, OGG, etc.)

## License

MIT