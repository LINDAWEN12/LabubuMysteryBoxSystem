import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/api-response';
import { RegisterDto, LoginDto } from '../types';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req, res, next) => {
  try {
    const registerDto: RegisterDto = req.body;
    const user = await authService.register(registerDto);
    res.json(ApiResponse.success(user));
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const loginDto: LoginDto = req.body;
    const { token, user } = await authService.login(loginDto);
    res.json(ApiResponse.success({ token, user }));
  } catch (error) {
    next(error);
  }
});

export default router ;