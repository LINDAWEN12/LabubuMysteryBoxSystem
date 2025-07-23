import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import { authRouter } from './controllers/auth.controller';
import blindboxRouter from './controllers/blindbox.controller';
import orderRouter from './controllers/order.controller';
import showcaseRouter from './controllers/showcase.controller';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { ApiResponse } from './utils/api-response';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private config(): void {
    this.app.use(express.urlencoded({ extended: true }));
    
    // 扩展Response对象
    this.app.use((_req, res, next) => {
      ApiResponse.setupResponseExtensions(res);
      next();
    });
  }

  private initializeMiddlewares(): void {
    // 1. CORS 中间件
    this.app.use(cors({
      origin: ['http://localhost:3000'],
      credentials: true
    }));

    // 2. JSON 请求体解析
    this.app.use(express.json());

    // 3. 请求日志记录
    this.app.use(loggerMiddleware);

    // 注意：authMiddleware 不在这里全局应用
  }

  private initializeRoutes(): void {
    // 不需要认证的路由
    this.app.use('/api/auth', authRouter);
    
    // 需要认证的路由组
    const apiRouter = express.Router();
    apiRouter.use(authMiddleware); // 只对这些路由应用认证
    apiRouter.use('/blindboxes', blindboxRouter);
    apiRouter.use('/orders', orderRouter);
    apiRouter.use('/showcases', showcaseRouter);
    
    this.app.use('/api', apiRouter);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  private async initializeDatabase(): Promise<void> {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('✅ 数据库连接成功');
        
        // 开发环境下同步实体
        if (process.env.NODE_ENV === 'development') {
          await AppDataSource.synchronize();
          console.log('🔄 实体已同步');
        }
      }
    } catch (error) {
      console.error('❌ 数据库连接失败:', error);
      process.exit(1);
    }
  }

  public async start(port: number = 3001): Promise<void> {
    await this.initializeDatabase();
    
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        console.log(`🚀 服务已启动，监听端口 ${port}`);
        console.log(`📡 访问地址: http://localhost:${port}`);
        resolve();
      });
    });
  }
}

// 应用启动入口
(async () => {
  try {
    const app = new App();
    await app.start();
    
    // 导出app实例供测试使用

  } catch (error) {
    console.error('🔥 应用启动失败:', error);
    process.exit(1);
  }
})();