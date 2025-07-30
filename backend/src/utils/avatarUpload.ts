import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

// 头像存储配置
const avatarStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // 指定头像存储目录
    cb(null, path.join(__dirname, '../../uploads/avatars'));
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // 生成更安全的文件名：UUID + 原始扩展名
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

// 头像文件过滤器
const avatarFileFilter = (
  req: Request, 
  file: Express.Multer.File, 
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传JPEG、PNG、GIF或WebP格式的图片'));
  }
};

// 导出头像上传中间件
export const avatarUpload = multer({ 
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB限制
    files: 1 // 只允许上传1个文件
  }
});