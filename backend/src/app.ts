/**
 * 应用程序入口文件
 * 负责初始化Express应用、配置中间件、定义路由和连接数据库
 * 采用MVC架构，分离控制器、服务和数据访问层
 */
import express, { Application } from 'express';
import cors from 'cors';
import { AppDataSource, initializeDatabase } from './config/database';
import authRouter from './controllers/auth.controller';
import { blindboxRouter } from './controllers/blindbox.controller';
import { orderRouter } from './controllers/order.controller';
import { showcaseRouter } from './controllers/showcase.controller';
import { userRouter } from './controllers/user.controller';
import { drawRouter } from './controllers/draw.controller';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { ApiResponse } from './utils/api-response';
import { setupSwagger } from './utils/swagger';
import { createConnection } from 'typeorm';
import path from 'path';
import { AuthenticatedRequest } from './types/custom-request';

/**
 * 应用程序主类
 * 封装Express应用的配置和初始化
 */
class App {
  public app: express.Application;

  /**
   * 构造函数
   * 初始化应用程序的各个组件
   * 执行顺序: 数据库初始化 -> 配置 -> 中间件 -> 路由 -> 错误处理 -> Swagger文档
   */
  constructor() {
    this.app = express();
    this.initializeDatabase();
    this.config();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSwagger();
  }

  /**
   * 初始化数据库连接
   * 使用TypeORM创建数据库连接
   * 连接失败时会退出应用程序
   */
  private async initializeDatabase(): Promise<void> {
    try {
      await createConnection({
        name: "default", // 明确指定连接名称
        type: "mysql", // 数据库类型
        host: "localhost", // 数据库主机
        port: 3306, // 数据库端口
        username: "root", // 数据库用户名
        password: "tianru12", // 数据库密码
        database: "blindbox_db", // 数据库名称
        entities: [__dirname + "/entities/*.entity{.ts,.js}"], // 实体文件路径
        synchronize: true, // 开发环境下自动同步实体(生产环境应禁用)
        logging: true // 启用SQL日志
      });
      console.log('数据库连接成功');
    } catch (error) {
      console.error('数据库连接失败:', error);
      process.exit(1); // 连接失败时退出应用
    }
  }

  /**
   * 配置Express应用
   * 设置请求体解析和API响应扩展
   */
  private config(): void {
    // 解析URL编码的请求体
    // extended: true 允许解析复杂的嵌套对象
    this.app.use(express.urlencoded({ extended: true }));
    // 设置API响应扩展
    this.app.use((_, res, next) => {
      ApiResponse.setupResponseExtensions(res);
      next();
    });
  }

  /**
   * 初始化中间件
   * 配置CORS、JSON解析和日志
   */
  private initializeMiddlewares(): void {
    // 配置CORS
    this.app.use(cors({
      origin: ['http://localhost:3000'], // 允许的前端源
      credentials: true, // 允许携带凭证(cookies)
      methods: ['GET', 'POST', 'PUT', 'DELETE'] // 允许的HTTP方法
    }));
    // 解析JSON请求体
    this.app.use(express.json());
    // 日志中间件 - 记录所有请求
    this.app.use(loggerMiddleware);
  }

  /**
   * 初始化路由
   * 定义应用程序的所有路由
   * 分为公共路由和受保护路由两部分
   */
  private initializeRoutes(): void {
    // 健康检查路由
    this.app.get('/', (req, res) => {
      res.json({
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    });

    // 公共路由 - 不需要认证
    this.app.use('/api/auth', authRouter); // 认证相关路由(登录、注册)
    this.app.use('/api/auth', userRouter); // 用户相关路由(通过/auth路径)
    this.app.use('/api/user', userRouter); // 用户相关路由(通过/user路径)
    this.app.use('/api/draw', drawRouter); // 抽奖相关路由
    this.app.use('/api/showcases', showcaseRouter); // 玩家秀相关路由

    // 静态文件服务
    this.app.use('/public', express.static(path.join(__dirname, '../public')));
    this.app.use('/images', express.static(path.join(__dirname, '../public/images')));
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // 受保护的路由 - 需要认证
    const protectedRouter = express.Router();
    protectedRouter.use(authMiddleware); // 应用认证中间件
    protectedRouter.use('/blindboxes', blindboxRouter); // 盲盒相关路由
    protectedRouter.use('/orders', orderRouter); // 订单相关路由

    // 用户资料路由
    protectedRouter.get('/profile', (req: AuthenticatedRequest, res) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      res.json({
        id: req.user.id,
        username: req.user.username,
        balance: req.user.balance,
        avatar: req.user.avatar
      });
    });

    // 注册受保护的路由
    this.app.use('/api', protectedRouter);
  }

  /**
   * 初始化错误处理
   * 应用全局错误处理中间件
   */
  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  /**
   * 初始化Swagger文档
   * 仅在非生产环境启用
   */
  private initializeSwagger(): void {
    if (process.env.NODE_ENV !== 'production') {
      setupSwagger(this.app);
    }
  }

  /**
   * 启动服务器
   * @param port 服务器端口，默认3001
   * @returns Promise<void> 当服务器成功启动时解析
   */
  public async start(port: number = 3001): Promise<void> {
    await initializeDatabase();
    
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
        console.log(`📚 API Docs available at http://localhost:${port}/api-docs`);
        resolve();
      });
    });
  }
}

/**
 * 启动应用程序
 * 使用IIFE(立即调用函数表达式)异步启动应用
 */
(async () => {
  try {
    const app = new App();
    await app.start();
  } catch (error) {
    console.error('🔥 Failed to start application:', error);
    process.exit(1);
  }
})();