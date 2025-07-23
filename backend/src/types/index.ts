import { User } from '../entities/user.entity';
import { BlindBox } from '../entities/blindbox.entity';
import { BoxItem } from '../entities/box-item.entity';

/**
 * 用户注册DTO
 */
export interface RegisterDto {
  username: string;
  password: string;
  avatar?: string;
}

/**
 * 用户登录DTO
 */
export interface LoginDto {
  username: string;
  password: string;
}

/**
 * 创建玩家秀DTO
 */
export interface CreateShowcaseDto {
  userId: number;
  itemId: number;
  image: string;
  comment: string;
}

/**
 * 搜索参数
 */
export interface SearchParams {
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 盲盒详情响应
 */
export interface BlindBoxDetail extends BlindBox {
  items: BoxItem[];
  drawCount?: number;
}

/**
 * 用户简略信息
 */
export type UserProfile = Pick<User, 'id' | 'username' | 'avatar'>;