import { AppDataSource } from './src/config/database';

(async () => {
  try {
    console.log('🛠️ 尝试初始化数据源...');
    await AppDataSource.initialize();
    console.log('✅ 数据源初始化成功');
    
    console.log('📊 检查数据库表...');
    const tables = await AppDataSource.query("SHOW TABLES");
    console.log(`🔍 发现 ${tables.length} 张表`, tables);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 诊断失败:', error);
    process.exit(1);
  }
})();