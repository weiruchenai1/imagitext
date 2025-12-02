# 统一的前后端 Dockerfile - 单镜像部署
# 多阶段构建：先构建前端，再打包到后端镜像

# ============================================
# 阶段 1: 构建前端
# ============================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端 package 文件
COPY package*.json ./

# 安装前端依赖
RUN npm ci --legacy-peer-deps --prefer-offline --no-audit

# 复制前端源代码
COPY . .

# 构建前端应用
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ============================================
# 阶段 2: 构建后端（生产镜像）
# ============================================
FROM node:22-alpine

WORKDIR /app

# 复制后端 package 文件
COPY server/package*.json ./

# 安装后端生产依赖
RUN npm ci --omit=dev --prefer-offline --no-audit

# 复制后端源代码
COPY server/ ./

# 从前端构建阶段复制构建产物到后端的 public 目录
COPY --from=frontend-builder /app/frontend/dist ./public

# 创建 uploads 目录
RUN mkdir -p uploads

# 暴露端口（只需要一个端口）
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# 启动服务
CMD ["npm", "start"]
