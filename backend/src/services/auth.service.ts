/**
 * 认证服务
 * 处理用户注册、登录等认证相关的业务逻辑
 * 包含密码加密、JWT令牌生成等核心功能
 */
import { AppDataSource } from '../config/database';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto } from '../types';
import { ApiError } from '../utils/api-error';

/**
 * 认证服务类
 * 提供用户注册和登录的业务逻辑处理
 */
export class AuthService {
  // 用户仓库，用于数据库操作
  private userRepository = AppDataSource.getRepository(User);

  /**
   * 用户注册
   * @param registerDto - 注册信息数据传输对象
   * @returns 注册成功的用户对象
   * @throws ApiError - 当用户名已存在时抛出400错误
   */
  async register(registerDto: RegisterDto): Promise<User> {
    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: registerDto.username }
    });
    
    if (existingUser) {
      throw new ApiError(400, 'Username already exists');
    }

    // 密码加密，saltRounds为10
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // 创建新用户
    const user = this.userRepository.create({
      username: registerDto.username,
      password: hashedPassword,
      avatar: registerDto.avatar || '' // 头像可选
    });

    // 保存用户到数据库
    return this.userRepository.save(user);
  }

  /**
   * 用户登录
   * @param loginDto - 登录信息数据传输对象
   * @returns 包含JWT令牌和用户信息的对象
   * @throws ApiError - 当用户不存在或密码错误时抛出401错误
   */
  async login(loginDto: LoginDto) {
    // 1. 查询用户，只选择必要字段
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
      select: ['id', 'username', 'password', 'balance', 'avatar'] // 明确指定要查询的字段
    });

    console.log('查询到的用户:', user); // 调试日志

    if (!user) {
      throw new ApiError(401, '用户不存在');
    }

    // 2. 验证密码
    const isValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isValid) {
      throw new ApiError(401, '密码错误');
    }

    // 3. 生成JWT令牌
    const token = jwt.sign(
      { userId: user.id }, //  payload，包含用户ID
      process.env.JWT_SECRET || 'your-secret-key', // 密钥，优先使用环境变量
      { expiresIn: '1h' } // 令牌有效期1小时
    );

    // 返回令牌和用户信息(不含密码)
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        balance: user.balance,
        avatar: user.avatar
      }
    };
  }
}