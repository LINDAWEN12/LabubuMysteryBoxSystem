import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { BlindBox } from '../entities/blindbox.entity';
import { BoxItem } from '../entities/box-item.entity';
import { Order } from '../entities/order.entity';
import { Showcase } from '../entities/showcase.entity';
import dotenv from 'dotenv';

dotenv.config();

export const DatabaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'tianru12',
  database: process.env.DB_DATABASE || 'blindbox_db',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DB_LOGGING === 'true',
  entities: [User, BlindBox, BoxItem, Order, Showcase],
  migrations: [],
  subscribers: [],
  poolSize: 10,
  extra: {
    connectionLimit: 100
  }
};

export const AppDataSource = new DataSource(DatabaseConfig);

// 安全初始化函数
let isInitializing = false; // 防止重复初始化

export async function initializeDatabase() {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  if (isInitializing) {
    throw new Error("Database initialization already in progress");
  }

  try {
    isInitializing = true;
    
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    if (process.env.NODE_ENV === "development") {
      await AppDataSource.synchronize();
      console.log("🔄 Entities synchronized");
      
      // 开发环境可选：自动运行迁移
      // await AppDataSource.runMigrations();
    }

    return AppDataSource;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    
    // 生产环境需要更优雅的重试机制
    if (process.env.NODE_ENV === "production") {
      await new Promise(resolve => setTimeout(resolve, 5000));
      return initializeDatabase(); // 自动重试
    } else {
      process.exit(1);
    }
  } finally {
    isInitializing = false;
  }

}