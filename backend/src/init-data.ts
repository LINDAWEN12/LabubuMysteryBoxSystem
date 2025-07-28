import { createConnection, getConnection } from 'typeorm';
import { BlindBox } from './entities/blindbox.entity';
import { BoxItem } from './entities/box-item.entity';
import { DatabaseConfig } from './config/database';

async function initializeData() {
  // 先创建数据库连接
  const connection = await createConnection(DatabaseConfig);
  
  try {
    // 清空现有数据（谨慎使用，仅用于开发环境）
    await connection.dropDatabase();
    await connection.synchronize();

    // 创建盲盒数据
    const blindBoxes = [
      {
        name: '夏日限定系列',
        description: '充满夏日风情的限定盲盒',
        price: 99.99,
        coverImage: '/images/box1.jpg',
        items: [
          { name: '夏日海豚', rarity: 'rare', weight: 20, image: '/images/pop1.jpg' },
          { name: '沙滩排球', rarity: 'common', weight: 40, image: '/images/pop2.jpg' },
          { name: '太阳镜', rarity: 'common', weight: 40, image: '/images/pop3.jpg' },
        
        ]
      },
      // 其他盲盒数据...
    ];

    // 保存盲盒数据
    const blindBoxRepo = connection.getRepository(BlindBox);
    const boxItemRepo = connection.getRepository(BoxItem);

    for (const boxData of blindBoxes) {
      const blindBox = blindBoxRepo.create({
        name: boxData.name,
        description: boxData.description,
        price: boxData.price,
        coverImage: boxData.coverImage
      });

      const savedBox = await blindBoxRepo.save(blindBox);

      for (const itemData of boxData.items) {
        const boxItem = boxItemRepo.create({
          ...itemData,
          box: savedBox
        });
        await boxItemRepo.save(boxItem);
      }
    }

    console.log('数据初始化完成！');
  } catch (error) {
    console.error('数据初始化失败:', error);
  } finally {
    // 关闭连接
    await connection.close();
  }
}

initializeData();