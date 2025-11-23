
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

## 配置文件模板 (.env)

请在项目根目录下创建一个名为 `.env` 的文件，并复制以下内容（**注意变量名必须以 VITE_ 开头**）：

```ini
# ==============================================
# ImagiText - 配置文件
# ==============================================

# [必须] 基础 API 密钥 (用于图片转提示词)
VITE_API_KEY=your_api_key_here

# [可选] AI 提供商 (gemini 或 openai)
VITE_AI_PROVIDER=gemini

# [可选] 基础模型名称 (用于分析图片)
VITE_AI_MODEL=gemini-2.5-flash

# [可选] 基础 API 地址 (如需代理)
#
# ⚠️ 重要：请勿在 URL 中包含版本号 (/v1 或 /v1beta)
#   - OpenAI 的代码会自动添加 /v1 前缀
#   - Gemini SDK 会自动添加 /v1beta 前缀
#
# 支持智能端点重试和特殊符号控制：
#
# 【标准模式】（无特殊符号）- 自动添加版本前缀
#   OpenAI: https://api.example.com → https://api.example.com/v1/chat/completions
#   Gemini: https://api.example.com → https://api.example.com/v1beta/models/...
#   示例: VITE_AI_BASE_URL=https://api.openai.com
#         （不要写成 https://api.openai.com/v1）
#
# 【/ 结尾】跳过版本前缀（适用于不需要 /v1 的第三方 API）
#   OpenAI: https://open.cherryin.net/ → https://open.cherryin.net/chat/completions
#   Gemini: https://api.example.com/ → https://api.example.com/models/...
#   示例: VITE_AI_BASE_URL=https://open.cherryin.net/
#
# 【# 结尾】强制使用精确地址（不做任何拼接）
#   直接使用该地址，不添加任何路径
#   示例: VITE_AI_BASE_URL=https://api.example.com/custom/endpoint#
#
# OpenAI 官方默认值: https://api.openai.com
# Gemini 官方默认值: https://generativelanguage.googleapis.com
VITE_AI_BASE_URL=

# ==============================================
# AI 绘画专用配置 (如果不填，默认使用基础配置)
# ==============================================

# [可选] 绘画专用 AI 提供商 (gemini 或 openai)
# 重要：此配置用于画图功能的智能路由，避免通过模型名称判断提供商
# 支持第三方 API，如果使用自定义模型名称，必须明确指定提供商
VITE_IMG_GEN_PROVIDER=

# [可选] 绘画专用 API Key
VITE_IMG_GEN_API_KEY=

# [可选] 绘画专用 Base URL
# ⚠️ 同样不要包含 /v1 或 /v1beta，代码会自动添加
# 支持相同的特殊符号控制（/, #），规则同上
VITE_IMG_GEN_BASE_URL=

# [可选] 绘画模型名称
# 此时页面上的"选择模型"下拉菜单将优先显示此模型。
# 支持配置多个模型（用逗号分隔），第一个为默认模型。
# 示例: VITE_IMG_GEN_MODEL=gemini-2.5-flash-image,dall-e-3,flux-pro
VITE_IMG_GEN_MODEL=gemini-2.5-flash-image
```

## 部署指南

### 1. 静态托管 (Vercel, Netlify, Cloudflare Pages)

这是一个基于 Vite/ESBuild 构建的纯客户端 React 应用。

1.  **克隆仓库**。
2.  **安装依赖**：`npm install`
3.  **构建**：`npm run build`
4.  **部署**：将 `dist` 文件夹上传到你的静态托管服务。
5.  **环境变量**：确保在托管平台的控制面板中添加 `VITE_API_KEY` 和其他相关环境变量。

### 2. Vercel 部署

**一键部署：**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/weiruchenai1/imagitext&project-name=imagitext)

## 技术栈

*   React 19
*   TypeScript
*   Tailwind CSS
*   Google GenAI SDK

---
&copy; 2025 ImagiText
