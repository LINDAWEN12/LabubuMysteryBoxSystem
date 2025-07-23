import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import { User } from '../entities/user.entity';
import { BlindBox } from '../entities/blindbox.entity';
import { BoxItem } from '../entities/box-item.entity';
import { Order } from '../entities/order.entity';
import { Showcase } from '../entities/showcase.entity';
import dotenv from 'dotenv';

dotenv.config();

// 数据库配置
export const DatabaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'tianru12', // 修改为您的密码
  database: process.env.DB_DATABASE || 'blindbox_db',
  synchronize: true,  // 自动同步实体类到数据库表
  logging: true,       // 显示SQL日志
  logger: "advanced-console",// 启用详细日志
  entities: [
    User,
    BlindBox,
    BoxItem,
    Order,
    Showcase
  ],
  migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
  subscribers: [path.join(__dirname, '../subscribers/*{.ts,.js}')],
  extra: {
    connectionLimit: 100 // 连接池大小
  }
   
};

// 创建数据源实例
export const AppDataSource = new DataSource(DatabaseConfig);

// 测试连接方法（可选）
export async function testConnection() {
  try {
    await AppDataSource.initialize();
    console.log('✅ 数据库连接成功');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    throw error;
  }
}