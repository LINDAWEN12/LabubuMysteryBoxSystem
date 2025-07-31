/**
 * 数据库配置文件
 * 负责配置TypeORM数据源、连接参数和初始化逻辑
 * 提供安全的数据库连接管理，支持开发和生产环境的不同配置
 */
import { DataSource, DataSourceOptions } from 'typeorm';
// 导入实体类
import { User } from '../entities/user.entity';
import { BlindBox } from '../entities/blindbox.entity';
import { BoxItem } from '../entities/box-item.entity';
import { Order } from '../entities/order.entity';
import { Showcase } from '../entities/showcase.entity';
// 加载环境变量
import dotenv from 'dotenv';

dotenv.config();

/**
 * TypeORM数据源配置
 * 根据环境变量设置数据库连接参数
 * 环境变量优先，其次使用默认值
 */
export const DatabaseConfig: DataSourceOptions = {
  type: 'mysql', // 数据库类型
  host: process.env.DB_HOST || 'localhost', // 数据库主机地址
  port: parseInt(process.env.DB_PORT || '3306'), // 数据库端口
  username: process.env.DB_USERNAME || 'root', // 数据库用户名
  password: process.env.DB_PASSWORD || 'tianru12', // 数据库密码
  database: process.env.DB_DATABASE || 'blindbox_db', // 数据库名称
  synchronize: process.env.NODE_ENV !== 'production', // 开发环境自动同步实体
  logging: process.env.DB_LOGGING === 'true', // 是否启用SQL日志
  entities: [User, BlindBox, BoxItem, Order, Showcase], // 注册实体类
  migrations: [], // 迁移文件
  subscribers: [], // 订阅者
  poolSize: 10, // 连接池大小
  extra: {
    connectionLimit: 100 // 额外连接限制
  }
};

/**
 * TypeORM数据源实例
 * 用于管理数据库连接和操作
 */
export const AppDataSource = new DataSource(DatabaseConfig);

// 防止重复初始化的标志
let isInitializing = false;

/**
 * 安全初始化数据库连接
 * 处理并发初始化请求，防止重复初始化
 * 开发环境下自动同步实体，生产环境下自动重试
 * @returns 已初始化的数据源实例
 * @throws 初始化失败时抛出错误
 */
export async function initializeDatabase() {
  // 检查是否已初始化
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  // 检查是否正在初始化中
  if (isInitializing) {
    throw new Error("Database initialization already in progress");
  }

  try {
    isInitializing = true;
    
    // 初始化数据源
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    // 开发环境下同步实体
    if (process.env.NODE_ENV === "development") {
      await AppDataSource.synchronize();
      console.log("🔄 Entities synchronized");
      
      // 开发环境可选：自动运行迁移
      // await AppDataSource.runMigrations();
    }

    return AppDataSource;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    
    // 生产环境下自动重试
    if (process.env.NODE_ENV === "production") {
      await new Promise(resolve => setTimeout(resolve, 5000));
      return initializeDatabase(); // 递归重试
    } else {
      process.exit(1); // 开发环境下直接退出
    }
  } finally {
    isInitializing = false; // 重置初始化标志
  }

}