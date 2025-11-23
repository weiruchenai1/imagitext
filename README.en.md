
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
#
# ⚠️ IMPORTANT: Do NOT include version numbers (/v1 or /v1beta) in the URL
#   - The code automatically adds /v1 prefix for OpenAI
#   - Gemini SDK automatically adds /v1beta prefix
#
# Supports intelligent endpoint retry and special suffix controls:
#
# 【Standard Mode】(No special suffix) - Auto-add version prefix
#   OpenAI: https://api.example.com → https://api.example.com/v1/chat/completions
#   Gemini: https://api.example.com → https://api.example.com/v1beta/models/...
#   Example: VITE_AI_BASE_URL=https://api.openai.com
#            (Do NOT write https://api.openai.com/v1)
#
# 【/ Suffix】Skip version prefix (for third-party APIs that don't need /v1)
#   OpenAI: https://open.cherryin.net/ → https://open.cherryin.net/chat/completions
#   Gemini: https://api.example.com/ → https://api.example.com/models/...
#   Example: VITE_AI_BASE_URL=https://open.cherryin.net/
#
# 【# Suffix】Force exact URL (no path appending)
#   Uses the URL as-is without any modifications
#   Example: VITE_AI_BASE_URL=https://api.example.com/custom/endpoint#
#
# OpenAI Official Default: https://api.openai.com
# Gemini Official Default: https://generativelanguage.googleapis.com
VITE_AI_BASE_URL=

# ==============================================
# AI Painting Specific Configuration (fallback to base config if not set)
# ==============================================

# [OPTIONAL] Dedicated AI Provider for Image Generation (gemini or openai)
# Important: This enables intelligent routing for image generation, avoiding provider detection by model name
# Supports third-party APIs - must explicitly specify provider when using custom model names
VITE_IMG_GEN_PROVIDER=

# [OPTIONAL] Dedicated Image Gen API Key
VITE_IMG_GEN_API_KEY=

# [OPTIONAL] Dedicated Image Gen Base URL
# ⚠️ Same rule: Do NOT include /v1 or /v1beta, code will auto-add them
# Supports same special suffix controls (/, #) as above
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
