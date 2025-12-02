# Docker 部署指南

本文档说明如何使用 Docker 和 Docker Compose 部署 ImagiText 应用。

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+

## 快速开始

有两种部署方式可供选择：

### 方式一：使用预构建镜像（推荐，最快）

直接使用 GitHub Container Registry 上的预构建镜像，无需构建。

#### 1. 下载配置文件

```bash
# 下载 docker-compose 配置
wget https://raw.githubusercontent.com/weiruchenai1/imagitext/main/docker-compose.prebuilt.yml -O docker-compose.yml

# 下载环境变量模板
wget https://raw.githubusercontent.com/weiruchenai1/imagitext/main/.env.example -O .env
```

或者克隆项目：

```bash
git clone https://github.com/weiruchenai1/imagitext.git
cd imagitext
cp docker-compose.prebuilt.yml docker-compose.yml
cp .env.example .env
```

#### 2. 配置环境变量

编辑 `.env` 文件，至少需要配置 `API_KEY`：

```ini
API_KEY=your_gemini_or_openai_api_key
```

#### 3. 启动服务

```bash
docker-compose up -d
```

镜像会自动从 GitHub Container Registry 拉取。

#### 4. 访问应用

- 前端：http://localhost:3000
- 后端：http://localhost:3001

### 方式二：本地构建镜像

适用于需要自定义代码或无法访问 GitHub Container Registry 的场景。

#### 1. 克隆项目

```bash
git clone https://github.com/weiruchenai1/imagitext.git
cd imagitext
```

#### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下环境变量：

```ini
# ========== 后端 API 配置 ==========

# 图片分析 API 密钥（必填）
API_KEY=your_gemini_or_openai_api_key

# AI 服务提供商: gemini 或 openai
AI_PROVIDER=gemini

# AI 模型
AI_MODEL=gemini-2.5-flash

# 自定义 API 基础 URL（可选，使用第三方代理时填写）
AI_BASE_URL=

# ========== 图片生成 API 配置 ==========

# 图片生成服务提供商: gemini 或 openai
IMG_GEN_PROVIDER=gemini

# 图片生成 API 密钥（可选，不填则使用 API_KEY）
IMG_GEN_API_KEY=

# 图片生成 API 基础 URL（可选）
IMG_GEN_BASE_URL=

# 图片生成模型
IMG_GEN_MODEL=gemini-2.5-flash-image-preview

# ========== 前端配置 ==========

# 前端访问后端的 API URL
# 本地开发: http://localhost:3001
# 生产环境: 使用实际的后端 URL
VITE_API_URL=http://localhost:3001

# CORS 允许的前端 URL
# 本地开发: http://localhost:3000
# 生产环境: 使用实际的前端 URL
CORS_ORIGIN=http://localhost:3000
```

#### 3. 启动服务（本地构建）

```bash
# 构建并启动所有服务（首次运行会构建镜像，需要几分钟）
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看特定服务的日志
docker-compose logs -f frontend
docker-compose logs -f backend
```

### 4. 访问应用

- **前端**: http://localhost:3000
- **后端 API**: http://localhost:3001
- **健康检查**: http://localhost:3001/health

## Docker 镜像信息

### 自动构建

每次推送到 `main` 分支或创建新的版本标签时，GitHub Actions 会自动构建并发布 Docker 镜像到 GitHub Container Registry。

### 可用镜像

```bash
# 前端镜像
docker pull ghcr.io/weiruchenai1/imagitext-frontend:latest

# 后端镜像
docker pull ghcr.io/weiruchenai1/imagitext-backend:latest
```

### 版本标签

- `latest` - 最新的主分支构建
- `v1.0.0` - 具体版本标签
- `main` - 主分支的最新构建

### 镜像说明

| 镜像 | 说明 | 大小 |
|------|------|------|
| imagitext-frontend | 前端应用（基于 Nginx Alpine） | ~50MB |
| imagitext-backend | 后端 API（基于 Node.js Alpine） | ~200MB |

## 常用命令

### 停止服务

```bash
docker-compose down
```

### 停止并删除数据卷

```bash
docker-compose down -v
```

### 重新构建镜像

```bash
docker-compose build --no-cache
docker-compose up -d
```

### 查看运行状态

```bash
docker-compose ps
```

### 进入容器

```bash
# 进入后端容器
docker-compose exec backend sh

# 进入前端容器
docker-compose exec frontend sh
```

### 查看资源使用情况

```bash
docker stats
```

## 生产环境部署

### 方案 1: 使用域名和反向代理

如果你有域名和 Nginx 反向代理，可以这样配置：

1. **修改 `.env` 文件**:

```ini
# 使用实际的域名
VITE_API_URL=https://api.yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

2. **Nginx 配置示例**:

```nginx
# 前端
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 后端 API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 方案 2: 单端口部署

修改 `docker-compose.yml`，只暴露前端端口，后端通过内部网络通信：

```yaml
services:
  backend:
    # 移除 ports 配置，只在内部网络通信
    # ports:
    #   - "3001:3001"

  frontend:
    ports:
      - "80:80"
```

修改 `.env`:

```ini
# 前端通过 Docker 内部网络访问后端
VITE_API_URL=http://backend:3001
CORS_ORIGIN=http://localhost
```

### 方案 3: 使用独立的网络和密钥管理

对于生产环境，建议：

1. 使用 Docker Secrets 或外部密钥管理服务
2. 配置日志驱动和监控
3. 启用 HTTPS
4. 设置资源限制

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 数据持久化

上传的图片存储在 Docker Volume 中：

```bash
# 查看 volume
docker volume ls

# 备份 volume
docker run --rm -v imagitext_backend_uploads:/data -v $(pwd):/backup \
  alpine tar czf /backup/uploads-backup.tar.gz -C /data .

# 恢复 volume
docker run --rm -v imagitext_backend_uploads:/data -v $(pwd):/backup \
  alpine tar xzf /backup/uploads-backup.tar.gz -C /data
```

## 故障排查

### 前端无法连接后端

1. 检查 `VITE_API_URL` 是否配置正确
2. 确认后端服务是否正常运行：`docker-compose logs backend`
3. 检查网络连接：`docker network inspect imagitext-network`

### 后端 API 错误

1. 检查环境变量是否配置正确，特别是 `API_KEY`
2. 查看后端日志：`docker-compose logs backend`
3. 检查健康状态：`curl http://localhost:3001/health`

### 容器启动失败

1. 查看详细日志：`docker-compose logs <service-name>`
2. 检查端口是否被占用：`netstat -tuln | grep -E '3000|3001'`
3. 重新构建镜像：`docker-compose build --no-cache`

### 内存或 CPU 使用过高

1. 限制资源使用（见方案 3）
2. 检查是否有内存泄漏：`docker stats`
3. 考虑使用更轻量的基础镜像

## 更新部署

### 使用预构建镜像

```bash
# 拉取最新镜像
docker-compose pull

# 重启服务
docker-compose up -d

# 清理旧镜像
docker image prune -f
```

### 使用本地构建

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build

# 清理旧镜像
docker image prune -f
```

## 安全建议

1. **不要将 `.env` 文件提交到版本控制**
2. **定期更新 Docker 镜像**：`docker-compose pull`
3. **使用 HTTPS** 加密通信
4. **限制容器权限**：避免使用 root 用户运行
5. **配置防火墙**：只开放必要的端口
6. **定期备份数据**：备份 uploads volume 和数据库（如有）

## 监控和日志

### 查看实时日志

```bash
docker-compose logs -f --tail=100
```

### 导出日志

```bash
docker-compose logs > app-logs.txt
```

### 集成日志系统

生产环境建议使用 ELK Stack 或其他日志聚合工具：

```yaml
services:
  backend:
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://logserver:514"
```

## 性能优化

1. **使用多阶段构建**（已实现）减小镜像体积
2. **启用 Gzip 压缩**（已在 nginx.conf 中配置）
3. **配置缓存策略**（已配置）
4. **使用 CDN** 分发静态资源
5. **启用 HTTP/2**

## License

本项目采用 MIT 许可证。
