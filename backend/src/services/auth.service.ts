import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto } from '../types';
import { ApiError } from '../utils/api-error';

export class AuthService {
  private userRepository = getRepository(User);

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

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userRepository.findOne({ 
      where: { username: loginDto.username },
      select: ['id', 'username', 'password', 'avatar']
    });
    
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new ApiError(401, 'Invalid credentials');
    }

    return jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  }
}