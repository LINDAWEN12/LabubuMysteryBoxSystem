# 泡泡盲盒抽奖系统

作者：林天问 241250034

## 项目简介
泡泡盲盒抽奖系统是一个基于前后端分离架构的在线盲盒销售与抽奖平台。用户可以浏览不同类型的盲盒，进行购买和抽奖，查看自己的订单和收藏。

## 技术栈

### 前端
- React
- Vite
- Tailwind CSS
- Axios

### 后端
- Node.js
- Express
- TypeScript
- TypeORM
- MySQL

### 部署与工具
- Docker
- Docker Compose
- Git

## 项目结构
```
LabubuMysteryBoxSystem/
├── .gitignore              # Git忽略文件
├── Dockerfile              # Docker构建文件
├── docker-compose.yml      # Docker Compose配置
├── readme.md               # 项目说明文档
├── backend/                # 后端代码
│   ├── src/                # 源代码
│   │   ├── app.ts          # 应用入口
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── entities/       # 实体类
│   │   ├── middlewares/    # 中间件
│   │   ├── services/       # 服务层
│   │   ├── types/          # 类型定义
│   │   └── utils/          # 工具函数
│   ├── package.json        # 后端依赖
│   └── tsconfig.json       # TypeScript配置
└── frontend/               # 前端代码
    ├── src/                # 源代码
    │   ├── App.jsx         # 根组件
    │   ├── api/            # API请求
    │   ├── components/     # 通用组件
    │   ├── pages/          # 页面组件
    │   └── main.jsx        # 入口文件
    ├── package.json        # 前端依赖
    ├── tailwind.config.js  # Tailwind配置
    └── vite.config.js      # Vite配置
```

## 功能特点
1. 用户系统：注册、登录、个人信息管理
2. 盲盒展示：不同系列盲盒展示，详情查看
3. 盲盒购买：支持单个和批量购买
4. 抽奖功能：模拟盲盒开箱，随机获得商品
5. 订单管理：查看历史订单和订单详情
6. 收藏系统：收藏喜欢的盲盒和商品
7. 管理员后台：商品管理、订单管理、用户管理

## 安装与运行

### 前提条件
- Node.js (v16+) 和 npm
- MySQL (v8.0+) 或 Docker
- Git

### 本地运行

1. 克隆项目
```bash
git clone <项目仓库地址>
cd LabubuMysteryBoxSystem
```

2. 安装依赖
```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../frontend
npm install
```

3. 配置环境变量
在backend目录下创建.env文件，添加以下内容：
```
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=labubu_db

# 服务器配置
PORT=3000
JWT_SECRET=your_jwt_secret
```

4. 初始化数据库
```bash
# 确保MySQL服务已启动
cd backend
npm run init-db
```

5. 启动服务
```bash
# 启动后端
cd backend
npm run dev

# 启动前端 (新终端)
cd frontend
npm run dev
```

### 使用Docker运行
1. 确保Docker和Docker Compose已安装
2. 构建和启动容器
```bash
docker-compose up --build
```
3. 访问应用：http://localhost:8080
