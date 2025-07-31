/**
 * 日志工具
 * 使用winston库创建的可配置日志记录器
 * 支持控制台输出和文件存储，提供不同级别的日志记录功能
 * 
 * 主要功能:
 * 1. 支持多种日志级别: error, warn, info, verbose, debug, silly
 * 2. 提供控制台彩色输出，便于开发调试
 * 3. 将错误日志和所有日志分别存储到不同文件
 * 4. 自定义日志格式，包含时间戳和日志级别
 */
import winston from 'winston';

// 导入winston格式化工具
const { combine, timestamp, printf, colorize } = winston.format;

/**
 * 日志格式化函数
 * 定义日志输出的格式
 * @param {Object} param - 日志对象
 * @param {string} param.level - 日志级别
 * @param {string|Object} param.message - 日志消息，可以是字符串或对象
 * @param {string} param.timestamp - 日志时间戳
 * @returns {string} 格式化后的日志字符串
 */
const logFormat = printf(({ level, message, timestamp }) => {
  // 如果message是对象，则转换为JSON字符串
  const logMessage = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
  return `${timestamp} [${level}]: ${logMessage}`;
});

/**
 * Winston日志记录器实例
 * 配置了控制台输出和文件存储
 * 
 * 日志级别(从高到低):
 * - error: 错误信息
 * - warn: 警告信息
 * - info: 一般信息
 * - verbose: 详细信息
 * - debug: 调试信息
 * - silly: 冗余信息
 */
export const logger = winston.createLogger({
  level: 'info', // 默认日志级别
  format: combine(
    colorize(), // 控制台输出带颜色
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 时间戳格式
    logFormat // 自定义日志格式
  ),
  transports: [
    // 控制台输出
    new winston.transports.Console(), 
    // 错误日志文件，只记录error级别
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }), 
    // 所有日志文件，记录所有级别的日志
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }) 
  ]
});