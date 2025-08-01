# 阶段1: 构建前端
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# 阶段2: 构建后端
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# 阶段3: 运行阶段
FROM node:18-alpine
WORKDIR /app

# 复制后端必要文件
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package.json ./
COPY --from=backend-builder /app/backend/init-data.js ./

# 复制前端构建产物到public目录
COPY --from=frontend-builder /app/frontend/dist ./public

# 安装mysql客户端用于初始化数据
RUN apk add --no-cache mysql-client

# 暴露端口
EXPOSE 3000

# 启动命令 (先初始化数据，再启动服务)
CMD sh -c "node init-data.js && node dist/index.js"