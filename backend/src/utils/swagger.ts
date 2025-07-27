import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '盲盒抽盒机API文档',
      version: '1.0.0',
      description: '盲盒抽盒机后端API文档',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: '本地开发服务器'
      },
    ],
    components: {} // 这里留空，实际组件从类型文件中加载
  },
  apis: [
    path.join(__dirname, '../controllers/*.controller.ts'),
    path.join(__dirname, '../types/index.ts') // 确保加载类型定义
  ],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: '盲盒抽盒机API文档'
  }));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};