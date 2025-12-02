
<div align="center">

# ImagiText
> A minimal tool for Image-to-Prompt conversion and AI Painting.

[中文](./README.md) | **English**

[![Contributors](https://img.shields.io/github/contributors/weiruchenai1/imagitext?style=flat&color=orange)](https://github.com/weiruchenai1/imagitext/graphs/contributors)
[![GitHub stars](https://img.shields.io/github/stars/weiruchenai1/imagitext?style=flat&color=yellow)](https://github.com/weiruchenai1/imagitext/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/weiruchenai1/imagitext?style=flat&color=green)](https://github.com/weiruchenai1/imagitext/network/members)

[![License](https://img.shields.io/github/license/weiruchenai1/imagitext?style=flat&color=blue)](https://github.com/weiruchenai1/imagitext/blob/main/LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E=20.19.0-brightgreen?style=flat&logo=node.js)](https://nodejs.org/)
[![Top Language](https://img.shields.io/github/languages/top/weiruchenai1/imagitext?style=flat&logo=typescript&color=yellow)](https://github.com/weiruchenai1/imagitext)

</div>

## Features

*   **Image Analysis**: Extracts detailed visual descriptions from uploaded images.
*   **Dual Language**: Generates prompts in both English and Simplified Chinese with a toggleable UI.
*   **Clean UI**: Minimalist, monochrome design with smooth transitions and animations.
*   **Dark Mode**: Fully supported dark theme.
*   **Multi-Provider Support**: Compatible with Google Gemini and OpenAI (or OpenAI-compatible) APIs.
*   **AI Painting Support**: Dedicated configuration for Image Generation API (e.g., DALL-E 3) separate from the analysis API.
*   **Image Link Support**: Analyze images directly from URLs.
*   **Secure Architecture**: Backend API proxy protects API keys from frontend exposure.

## Architecture

This project uses a client-server architecture:

- **Frontend**: React + Vite application (port 3000)
- **Backend**: Express API server (port 3001)

The backend server manages all AI API keys, and the frontend calls AI services through the backend proxy to ensure key security.

## Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment Variables

#### Frontend Configuration (`.env`)

Create `.env` file in project root:

```ini
# Frontend Configuration
VITE_API_URL=http://localhost:3001
```

#### Backend Configuration (`server/.env`)

Create `.env` file in `server/` directory:

```ini
# Backend API Configuration

# Server Port
PORT=3001

# Image Analysis API Configuration
API_KEY=your_gemini_or_openai_api_key
AI_PROVIDER=gemini
AI_MODEL=gemini-2.5-flash
AI_BASE_URL=

# Image Generation API Configuration
IMG_GEN_PROVIDER=gemini
IMG_GEN_API_KEY=your_image_generation_api_key
IMG_GEN_BASE_URL=
IMG_GEN_MODEL=gemini-2.5-flash-image-preview

# CORS Configuration (Frontend URL)
CORS_ORIGIN=http://localhost:3000
```

### 3. Start Services

Open two terminal windows:

**Terminal 1 - Start backend server:**
```bash
cd server
npm start
```

**Terminal 2 - Start frontend dev server:**
```bash
npm run dev
```

Visit `http://localhost:3000` to use the application.

## Get API Keys

- **Google Gemini**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## Deployment Guide

### Local Deployment

Follow the "Quick Start" steps to run locally.

### Production Deployment

#### Option 1: Separate Deployment

1. **Frontend** (Vercel/Netlify/Cloudflare Pages):
   ```bash
   npm install
   npm run build
   # Upload dist/ directory
   ```
   Environment variable: `VITE_API_URL=https://your-backend-api.com`

2. **Backend** (Any Node.js hosting service):
   ```bash
   cd server
   npm install
   npm start
   ```
   Configure all environment variables in `server/.env`.

#### Option 2: Same Server Deployment

Using Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend static files
    location / {
        root /path/to/dist;
        try_files $uri /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Frontend environment variable: `VITE_API_URL=/api`

## Tech Stack

### Frontend
*   React 19
*   TypeScript
*   Vite
*   Tailwind CSS

### Backend
*   Node.js + Express
*   Google GenAI SDK
*   Multer (file upload)
*   CORS

## Development

```bash
# Frontend dev (hot reload)
npm run dev

# Backend dev (auto restart)
cd server
npm run dev
```

## Build

```bash
# Build frontend
npm run build

# Preview build
npm run preview
```

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

&copy; 2025 ImagiText
