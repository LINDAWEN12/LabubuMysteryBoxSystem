import express from 'express';
import cors from 'cors';
import { AppDataSource, initializeDatabase } from './config/database';
import authRouter from './controllers/auth.controller';
import { blindboxRouter } from './controllers/blindbox.controller';
import { orderRouter } from './controllers/order.controller';
import { showcaseRouter } from './controllers/showcase.controller';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { ApiResponse } from './utils/api-response';
import { setupSwagger } from './utils/swagger'; // 新增导入
import { Application } from 'express';
import { createConnection } from 'typeorm';
import path from 'path'
import { AuthenticatedRequest } from './types/custom-request';
import { userRouter } from './controllers/user.controller';
import { drawRouter } from './controllers/draw.controller';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeDatabase();
    this.config();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSwagger(); // 新增Swagger初始化
  }
private async initializeDatabase(): Promise<void> {
    try {
      await createConnection({
        name: "default", // 明确指定连接名称
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "tianru12",
        database: "blindbox_db",
        entities: [__dirname + "/entities/*.entity{.ts,.js}"],
        synchronize: true,
        logging: true
      });
      console.log('数据库连接成功');
    } catch (error) {
      console.error('数据库连接失败:', error);
      process.exit(1); // 连接失败时退出应用
    }
  }
  private config(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((_, res, next) => {
      ApiResponse.setupResponseExtensions(res);
      next();
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(cors({
      origin: ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }));
    this.app.use(express.json());
    this.app.use(loggerMiddleware);
  }

  private initializeRoutes(): void {
    this.app.get('/', (req, res) => {
      res.json({
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    });

    // Public routes
    this.app.use('/api/auth', authRouter);
    this.app.use('/public', express.static(path.join(__dirname, '../public')));
    this.app.use('/images', express.static(path.join(__dirname, '../public/images')));
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    this.app.use('/api/draw', drawRouter);
    // Protected routes
    const protectedRouter = express.Router();
    protectedRouter.use(authMiddleware);
    protectedRouter.use('/blindboxes', blindboxRouter);
    protectedRouter.use('/orders', orderRouter);
    // 添加用户资料路由
    protectedRouter.get('/profile', (req: AuthenticatedRequest, res) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }// 现在可以安全访问 req.user 的所有属性
      res.json({
        id: req.user.id,
        username: req.user.username,
        balance: req.user.balance, // 可以访问 balance
        avatar: req.user.avatar    // 可以访问 avatar
      });
    });
    this.app.use('/api/showcases', showcaseRouter);
    this.app.use('/api/user', userRouter);
    this.app.use('/api', protectedRouter);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  // 新增Swagger初始化方法
  private initializeSwagger(): void {
    if (process.env.NODE_ENV !== 'production') {
      setupSwagger(this.app);
    }
  }

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

(async () => {
  try {
    const app = new App();
    await app.start();
  } catch (error) {
    console.error('🔥 Failed to start application:', error);
    process.exit(1);
  }
})();