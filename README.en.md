
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

## Configuration Template (.env)

Create a file named `.env` in the project root and copy the following content. **Note: Variables must start with VITE_**.

```ini
# ==============================================
# ImagiText - Configuration
# ==============================================

# [REQUIRED] Base API Key (for Image to Prompt)
VITE_API_KEY=your_api_key_here

# [OPTIONAL] AI Provider (gemini or openai)
VITE_AI_PROVIDER=gemini

# [OPTIONAL] Base Model Name (for analysis)
VITE_AI_MODEL=gemini-2.5-flash

# [OPTIONAL] Base API URL (for proxies)
# Gemini Default: https://generativelanguage.googleapis.com
# OpenAI Default: https://api.openai.com/v1
VITE_AI_BASE_URL=

# ==============================================
# AI Painting Specific Configuration
# ==============================================

# [OPTIONAL] Dedicated Image Gen API Key
VITE_IMG_GEN_API_KEY=

# [OPTIONAL] Dedicated Image Gen Base URL
VITE_IMG_GEN_BASE_URL=

# [OPTIONAL] Image Gen Model Name
# This will appear in the "Select Model" dropdown.
# Supports comma-separated values for multiple models.
# Example: VITE_IMG_GEN_MODEL=gemini-2.5-flash-image,dall-e-3,flux-pro
VITE_IMG_GEN_MODEL=gemini-2.5-flash-image
```

## Deployment

### 1. Static Hosting

1.  **Install**: `npm install`
2.  **Build**: `npm run build`
3.  **Deploy**: Upload the `dist` folder.
4.  **Environment Variables**: Add variables starting with `VITE_` in your hosting dashboard.

### 2. Vercel Deployment

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/weiruchenai1/imagitext&project-name=imagitext)

## Tech Stack

*   React 19
*   TypeScript
*   Tailwind CSS
*   Google GenAI SDK

---
&copy; 2025 ImagiText
