# 一键 Docker 部署 - ImagiText

快速使用 Docker 部署 ImagiText，支持预构建镜像和本地构建两种方式。

## 🚀 快速开始（使用预构建镜像）

### 1. 创建部署目录

```bash
mkdir imagitext && cd imagitext
```

### 2. 下载配置文件

```bash
# 下载 docker-compose 配置
wget https://raw.githubusercontent.com/weiruchenai1/imagitext/main/docker-compose.prebuilt.yml -O docker-compose.yml

# 下载环境变量模板
wget https://raw.githubusercontent.com/weiruchenai1/imagitext/main/.env.example -O .env
```

### 3. 配置 API 密钥

编辑 `.env` 文件，至少需要配置：

```ini
API_KEY=your_gemini_or_openai_api_key
```

### 4. 启动服务

```bash
docker-compose up -d
```

### 5. 访问应用

- 前端：http://localhost:3000
- 后端 API：http://localhost:3001

## 🐳 可用的 Docker 镜像

```bash
# 前端镜像
docker pull ghcr.io/weiruchenai1/imagitext-frontend:latest

# 后端镜像
docker pull ghcr.io/weiruchenai1/imagitext-backend:latest
```

## 📦 本地构建部署

如果需要自定义代码或无法访问 GitHub Container Registry：

```bash
# 克隆项目
git clone https://github.com/weiruchenai1/imagitext.git
cd imagitext

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 使用本地构建的 docker-compose
docker-compose up -d
```

## 🔄 更新部署

### 使用预构建镜像

```bash
docker-compose pull
docker-compose up -d
```

### 使用本地构建

```bash
git pull
docker-compose up -d --build
```

## 📖 详细文档

查看完整的部署文档：[DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)

包含：
- 生产环境部署方案
- 域名和反向代理配置
- 故障排查
- 安全建议
- 性能优化

## 🔧 常用命令

```bash
# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 查看运行状态
docker-compose ps

# 进入容器
docker-compose exec backend sh
```

## 📝 环境变量说明

| 变量 | 必填 | 说明 |
|------|------|------|
| `API_KEY` | ✅ | Gemini 或 OpenAI API 密钥 |
| `AI_PROVIDER` | ❌ | AI 服务商（gemini/openai，默认 gemini） |
| `AI_MODEL` | ❌ | AI 模型（默认 gemini-2.5-flash） |
| `IMG_GEN_API_KEY` | ❌ | 图片生成 API 密钥（不填则使用 API_KEY） |
| `IMG_GEN_PROVIDER` | ❌ | 图片生成服务商（默认 gemini） |
| `IMG_GEN_MODEL` | ❌ | 图片生成模型（默认 gemini-2.5-flash-image-preview） |
| `CORS_ORIGIN` | ❌ | CORS 允许的前端 URL（默认 http://localhost:3000） |

完整配置参见 `.env.example` 文件。

## 📦 镜像自动构建

本项目使用 GitHub Actions 自动构建并发布 Docker 镜像：

- ✅ 每次推送到 `main` 分支自动构建
- ✅ 创建版本标签时自动发布版本镜像
- ✅ 支持多种镜像标签（latest、版本号等）

查看构建状态：[Actions](https://github.com/weiruchenai1/imagitext/actions)

## ❓ 故障排查

### 前端无法连接后端

检查 `VITE_API_URL` 环境变量是否正确配置。

### API 调用失败

1. 检查 `API_KEY` 是否配置正确
2. 查看后端日志：`docker-compose logs backend`
3. 测试健康检查：`curl http://localhost:3001/health`

### 端口被占用

修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "8080:80"  # 前端改为 8080
  - "8081:3001"  # 后端改为 8081
```

## 📄 License

MIT License

---

更多信息请访问：[GitHub](https://github.com/weiruchenai1/imagitext)
