# 后端 Dockerfile
FROM node:22-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --omit=dev --prefer-offline --no-audit

# 复制源代码
COPY . .

# 创建 uploads 目录
RUN mkdir -p uploads

# 暴露端口
EXPOSE 3001

# 启动服务
CMD ["npm", "start"]
