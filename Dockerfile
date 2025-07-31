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

# 复制后端构建产物
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package.json ./backend/
COPY --from=backend-builder /app/backend/tsconfig.json ./backend/
COPY --from=backend-builder /app/backend/uploads ./backend/uploads
COPY --from=backend-builder /app/backend/public ./backend/public

# 复制前端构建产物到后端的public目录
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动命令
WORKDIR /app/backend
CMD ["node", "dist/app.js"]