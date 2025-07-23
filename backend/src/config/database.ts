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

export async function initializeDatabase() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database connected');
      
      if (process.env.NODE_ENV === 'development') {
        await AppDataSource.synchronize();
        console.log('🔄 Entities synchronized');
      }
    }
    return AppDataSource;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}