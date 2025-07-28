import { getConnection } from 'typeorm';
import { BlindBox } from '../entities/blindbox.entity';
import { BoxItem } from '../entities/box-item.entity';

async function initDatabase() {
  const connection = await getConnection();
  const blindBoxRepo = connection.getRepository(BlindBox);
  const boxItemRepo = connection.getRepository(BoxItem);

  // 清空现有数据
  await boxItemRepo.delete({});
  await blindBoxRepo.delete({});

  // 创建示例盲盒
  const summerBox = await blindBoxRepo.save({
    name: '夏日限定盲盒',
    description: '充满夏日风情的特别款盲盒',
    price: 99.99,
    coverImage: '/images/blindboxes/box1.jpg'
  });

  // 添加盲盒物品
  await boxItemRepo.save([
    {
      name: '夏日沙滩球',
      rarity: 'common',
      weight: 40,
      image: '/images/box-items/pop1.png',
      box: summerBox
    },
    {
      name: '限定太阳镜',
      rarity: 'rare',
      weight: 20,
      image: '/images/box-items/pop2.png',
      box: summerBox
    }
  ]);

  console.log('box数据库初始化完成');
}

initDatabase().catch(console.error);