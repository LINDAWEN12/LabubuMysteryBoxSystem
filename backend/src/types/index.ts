import { User } from '../entities/user.entity';
import { BlindBox } from '../entities/blindbox.entity';
import { BoxItem } from '../entities/box-item.entity';
/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           nullable: true
 *         error:
 *           type: string
 *           nullable: true
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "错误信息"
 *         code:
 *           type: integer
 *           example: 400
 * 
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: "user123"
 *         balance:
 *           type: number
 *           format: double
 *           example: 100.00
 *         avatar:
 *           type: string
 *           example: "avatar.jpg"
 * 
 *     BlindBox:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "夏日限定盲盒"
 *         description:
 *           type: string
 *           example: "夏季特别款盲盒"
 *         price:
 *           type: number
 *           format: double
 *           example: 99.99
 *         coverImage:
 *           type: string
 *           example: "box.jpg"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BoxItem'
 * 
 *     BoxItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "稀有物品A"
 *         rarity:
 *           type: string
 *           example: "rare"
 *         weight:
 *           type: integer
 *           example: 10
 *         image:
 *           type: string
 *           example: "item.jpg"
 * 
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         price:
 *           type: number
 *           format: double
 *           example: 99.99
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-05-01T12:00:00Z"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         box:
 *           $ref: '#/components/schemas/BlindBox'
 *         item:
 *           $ref: '#/components/schemas/BoxItem'
 * 
 *     Showcase:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         image:
 *           type: string
 *           example: "showcase.jpg"
 *         comment:
 *           type: string
 *           example: "这是我抽到的稀有物品！"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-05-01T12:00:00Z"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         item:
 *           $ref: '#/components/schemas/BoxItem'
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   parameters:
 *     pageParam:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         minimum: 1
 *         default: 1
 *       description: 页码
 *     limitParam:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 100
 *         default: 10
 *       description: 每页数量
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

export interface CreateBlindBoxDto {
  name: string;
  description: string;
  price: number;
  coverImage: string;
}

export interface CreateBoxItemDto {
  name: string;
  rarity: string;
  weight: number;
  coverImage: string;//未完成
}

/**
 * 用户简略信息
 */
export type UserProfile = Pick<User, 'id' | 'username' | 'avatar'>;