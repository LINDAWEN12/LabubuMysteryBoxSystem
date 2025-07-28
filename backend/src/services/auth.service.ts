import { AppDataSource } from '../config/database';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto } from '../types';
import { ApiError } from '../utils/api-error';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ 
      where: { username: registerDto.username } 
    });
    
    if (existingUser) {
      throw new ApiError(400, 'Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      username: registerDto.username,
      password: hashedPassword,
      avatar: registerDto.avatar || ''
    });

    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto) {
  // 1. 确保查询条件正确
  const user = await this.userRepository.findOne({
    where: { username: loginDto.username },
    select: ['id', 'username', 'password', 'balance', 'avatar']
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

  // 3. 生成token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );

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