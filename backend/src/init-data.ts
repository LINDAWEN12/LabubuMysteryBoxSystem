import { createConnection } from 'typeorm';
import { BlindBox } from './entities/blindbox.entity';
import { BoxItem } from './entities/box-item.entity';
import { User } from './entities/user.entity';
import { Showcase } from './entities/showcase.entity';
import { DatabaseConfig } from './config/database';
import * as bcrypt from 'bcrypt';

async function initializeData() {
  const connection = await createConnection(DatabaseConfig);
  
  try {
    // 清空并同步数据库
    await connection.dropDatabase();
    await connection.synchronize();

    // 1. 创建测试用户
    const userRepo = connection.getRepository(User);
    const users = await userRepo.save([
      userRepo.create({
        username: 'user1',
        password: await bcrypt.hash('password123', 10),
        balance: 500,
        avatar: '/images/box1.jpg'
      }),
      userRepo.create({
        username: 'user2',
        password: await bcrypt.hash('password123', 10),
        balance: 300,
        avatar: '/images/box1.jpg'
      }),
      userRepo.create({
        username: 'user3',
        password: await bcrypt.hash('password123', 10),
        balance: 1000,
        avatar: '/images/box1.jpg'
      })
    ]);

    // 2. 创建盲盒数据
    const blindBoxRepo = connection.getRepository(BlindBox);
    const boxItemRepo = connection.getRepository(BoxItem);
    
    // 夏日系列
    const summerBox = await blindBoxRepo.save(
      blindBoxRepo.create({
        name: '夏日限定系列',
        description: '充满夏日风情的限定盲盒',
        price: 99.99,
        coverImage: '/images/box1.jpg'
      })
    );

    const summerItems = await boxItemRepo.save([
      boxItemRepo.create({
        name: '夏日海豚',
        rarity: 'rare',
        weight: 20,
        image: '/images/pop1.jpg',
        box: summerBox
      }),
      boxItemRepo.create({
        name: '沙滩排球',
        rarity: 'common',
        weight: 40,
        image: '/images/pop2.jpg',
        box: summerBox
      }),
      boxItemRepo.create({
        name: '太阳镜',
        rarity: 'common',
        weight: 40,
        image: '/images/pop3.jpg',
        box: summerBox
      })
    ]);

    // 秋日系列
    const autumnBox = await blindBoxRepo.save(
      blindBoxRepo.create({
        name: '秋日限定系列',
        description: '充满秋日风情的限定盲盒',
        price: 99.99,
        coverImage: '/images/box2.jpg'
      })
    );

    const autumnItems = await boxItemRepo.save([
      boxItemRepo.create({
        name: '秋日枫叶',
        rarity: 'rare',
        weight: 20,
        image: '/images/pop4.jpg',
        box: autumnBox
      }),
      boxItemRepo.create({
        name: '丰收果实',
        rarity: 'common',
        weight: 40,
        image: '/images/pop5.jpg',
        box: autumnBox
      }),
      boxItemRepo.create({
        name: '秋日围巾',
        rarity: 'common',
        weight: 40,
        image: '/images/pop6.jpg',
        box: autumnBox
      })
    ]);

    // 3. 创建玩家秀数据
    const showcaseRepo = connection.getRepository(Showcase);
    
    // 确保所有物品都已加载
    const allItems = [...summerItems, ...autumnItems];
    const findItemByName = (name: string) => {
      const item = allItems.find(i => i.name === name);
      if (!item) throw new Error(`物品 ${name} 未找到`);
      return item;
    };

    await showcaseRepo.save([
      showcaseRepo.create({
        image: '/images/pop6.jpg',
        comment: '抽到了稀有的夏日海豚！太幸运了！',
        user: users[0],
        item: findItemByName('夏日海豚')
      }),
      showcaseRepo.create({
        image: '/images/pop6.jpg',
        comment: '秋日枫叶真的很美，值得收藏！',
        user: users[1],
        item: findItemByName('秋日枫叶')
      }),
      showcaseRepo.create({
        image: '/images/pop6.jpg',
        comment: '沙滩排球很适合夏天玩~',
        user: users[2],
        item: findItemByName('沙滩排球')
      }),
      showcaseRepo.create({
        image: '/images/pop6.jpg',
        comment: '秋日系列都很好看，继续收集！',
        user: users[0],
        item: findItemByName('秋日围巾')
      }),
      showcaseRepo.create({
        image: '/images/pop6.jpg',
        comment: '丰收果实看起来很美味~',
        user: users[1],
        item: findItemByName('丰收果实')
      })
    ]);

    console.log('🎉 数据初始化完成！包含:');
    console.log(`- ${users.length} 个用户`);
    console.log(`- 2 个盲盒系列`);
    console.log(`- ${allItems.length} 个盲盒物品`);
    console.log('- 5 个玩家秀展示');
  } catch (error) {
    console.error('❌ 数据初始化失败:', error);
  } finally {
    await connection.close();
  }
}

initializeData().catch(error => console.error('初始化脚本错误:', error));