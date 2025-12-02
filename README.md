
<div align="center">

# ImagiText
> 一个极简的 AI 图片转提示词与 AI 绘画工具

**中文** | [English](./README.en.md)

[![Contributors](https://img.shields.io/github/contributors/weiruchenai1/imagitext?style=flat&color=orange)](https://github.com/weiruchenai1/imagitext/graphs/contributors)
[![GitHub stars](https://img.shields.io/github/stars/weiruchenai1/imagitext?style=flat&color=yellow)](https://github.com/weiruchenai1/imagitext/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/weiruchenai1/imagitext?style=flat&color=green)](https://github.com/weiruchenai1/imagitext/network/members)

[![License](https://img.shields.io/github/license/weiruchenai1/imagitext?style=flat&color=blue)](https://github.com/weiruchenai1/imagitext/blob/main/LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E=20.19.0-brightgreen?style=flat&logo=node.js)](https://nodejs.org/)
[![Top Language](https://img.shields.io/github/languages/top/weiruchenai1/imagitext?style=flat&logo=typescript&color=yellow)](https://github.com/weiruchenai1/imagitext)

</div>

## 功能特点

*   **图片分析**：从上传的图片中提取详细的视觉描述。
*   **双语支持**：同时生成英文和简体中文的提示词，界面支持中英文切换。
*   **极简 UI**：单色极简设计，带有流畅的过渡和动画。
*   **深色模式**：完美支持深色/夜间模式。
*   **多模型支持**：兼容 Google Gemini 和 OpenAI（及兼容 OpenAI 格式）的 API。
*   **AI 绘画支持**：可配置专门的绘画 API（如 DALL-E 3 或 Gemini Image Gen），与分析 API 分离。
*   **图片链接支持**：直接通过 URL 分析网络图片。
*   **安全架构**：后端 API 代理保护 API 密钥，避免前端暴露。

## 架构说明

本项目采用前后端分离架构：

- **前端**：React + Vite 应用（端口 3000）
- **后端**：Express API 服务（端口 3001）

后端服务管理所有 AI API 密钥，前端通过后端代理调用 AI 服务，确保密钥安全。

## 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 2. 配置环境变量

#### 前端配置 (`.env`)

在项目根目录创建 `.env` 文件：

```ini
# Frontend Configuration
VITE_API_URL=http://localhost:3001
```

#### 后端配置 (`server/.env`)

在 `server/` 目录创建 `.env` 文件：

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

### 3. 启动服务

开启两个终端窗口：

**终端 1 - 启动后端服务：**
```bash
cd server
npm start
```

**终端 2 - 启动前端开发服务器：**
```bash
npm run dev
```

访问 `http://localhost:3000` 即可使用。

## API 密钥获取

- **Google Gemini**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## 部署指南

### 本地部署

按照"快速开始"步骤即可在本地运行。

### 生产部署

#### 方案 1：分离部署

1. **前端部署**（Vercel/Netlify/Cloudflare Pages）：
   ```bash
   npm install
   npm run build
   # 上传 dist/ 目录
   ```
   环境变量：`VITE_API_URL=https://your-backend-api.com`

2. **后端部署**（任何支持 Node.js 的服务器）：
   ```bash
   cd server
   npm install
   npm start
   ```
   配置好 `server/.env` 文件中的所有环境变量。

#### 方案 2：同服务器部署

使用 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/dist;
        try_files $uri /index.html;
    }

    # 后端 API 代理
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

前端环境变量设置为：`VITE_API_URL=/api`

## 技术栈

### 前端
*   React 19
*   TypeScript
*   Vite
*   Tailwind CSS

### 后端
*   Node.js + Express
*   Google GenAI SDK
*   Multer (文件上传)
*   CORS

## 开发

```bash
# 前端开发（热重载）
npm run dev

# 后端开发（自动重启）
cd server
npm run dev
```

## 构建

```bash
# 构建前端
npm run build

# 预览构建结果
npm run preview
```

## License

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

---

&copy; 2025 ImagiText
