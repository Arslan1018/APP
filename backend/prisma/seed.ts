import { PrismaClient, UserRole, ItemCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.qRScan.deleteMany();
  await prisma.qRCode.deleteMany();
  await prisma.aRModel.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  // ─── Owner User ──────────────────────────────────────────────
  const ownerPassword = await bcrypt.hash('Password123', 12);
  const owner = await prisma.user.create({
    data: {
      name: 'Demo Owner',
      email: 'demo@armenu.com',
      password: ownerPassword,
      role: UserRole.RESTAURANT_OWNER,
      isVerified: true,
    },
  });
  console.log(`✅ Owner created: ${owner.email}`);

  // ─── Restaurant ───────────────────────────────────────────────
  const restaurant = await prisma.restaurant.create({
    data: {
      ownerId: owner.id,
      name: 'Seaside Bites',
      slug: 'seaside-bites',
      description: 'Fresh seafood and local favourites with AR menu experience',
      address: '1F, No.5, Zhongshan N Rd',
      city: 'Taipei',
      country: 'TW',
      phone: '+886 2 2345 6789',
      currency: 'TWD',
      isActive: true,
    },
  });
  console.log(`✅ Restaurant created: ${restaurant.name}`);

  // ─── Menus ────────────────────────────────────────────────────
  const mainMenu = await prisma.menu.create({
    data: { restaurantId: restaurant.id, name: 'Main Menu', sortOrder: 0 },
  });
  const drinksMenu = await prisma.menu.create({
    data: { restaurantId: restaurant.id, name: 'Drinks', sortOrder: 1 },
  });
  console.log('✅ Menus created');

  // ─── Menu Items ───────────────────────────────────────────────
  const items = await Promise.all([
    prisma.menuItem.create({
      data: {
        menuId: mainMenu.id,
        name: 'Fish Ball Soup',
        description: 'Tender fish balls in a rich, savoury broth with spring onions and tofu',
        price: 120,
        category: ItemCategory.MAIN_COURSE,
        isAvailable: true,
        isPopular: true,
        calories: 280,
        allergens: ['fish'],
        tags: ['hot', 'seafood', 'soup'],
      },
    }),
    prisma.menuItem.create({
      data: {
        menuId: mainMenu.id,
        name: 'Crispy Chips',
        description: 'Golden crispy fries seasoned with sea salt and spice',
        price: 80,
        category: ItemCategory.SIDE,
        isAvailable: true,
        calories: 350,
        tags: ['crispy', 'vegetarian'],
      },
    }),
    prisma.menuItem.create({
      data: {
        menuId: mainMenu.id,
        name: 'Seafood Combo',
        description: 'A delightful combination of shrimp, squid, and fish with dipping sauce',
        price: 280,
        category: ItemCategory.SPECIAL,
        isAvailable: true,
        isPopular: true,
        calories: 520,
        allergens: ['shellfish', 'fish'],
        tags: ['seafood', 'combo', 'popular'],
      },
    }),
    prisma.menuItem.create({
      data: {
        menuId: drinksMenu.id,
        name: 'Taiwan Beer',
        description: 'Ice cold Taiwan Gold Medal Beer',
        price: 120,
        category: ItemCategory.BEVERAGE,
        isAvailable: true,
        calories: 140,
        tags: ['alcohol', 'cold'],
      },
    }),
    prisma.menuItem.create({
      data: {
        menuId: drinksMenu.id,
        name: 'Lemon Tea',
        description: 'Fresh brewed black tea with lemon, served cold',
        price: 60,
        category: ItemCategory.BEVERAGE,
        isAvailable: true,
        calories: 80,
        tags: ['cold', 'non-alcoholic'],
      },
    }),
  ]);
  console.log(`✅ ${items.length} menu items created`);

  // ─── AR Models (placeholder URLs — replace with real S3 URLs) ─
  await prisma.aRModel.create({
    data: {
      itemId: items[0].id, // Fish Ball Soup
      glbUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      scale: 0.8,
      animated: false,
    },
  });
  await prisma.aRModel.create({
    data: {
      itemId: items[2].id, // Seafood Combo
      glbUrl: 'https://modelviewer.dev/shared-assets/models/Horse.glb',
      scale: 0.5,
      animated: true,
    },
  });
  console.log('✅ AR models created');

  // ─── QR Codes ─────────────────────────────────────────────────
  for (const item of items.slice(0, 3)) {
    await prisma.qRCode.create({
      data: {
        itemId: item.id,
        code: `demo-${item.id.slice(0, 8)}`,
        isActive: true,
      },
    });
  }
  console.log('✅ QR codes created');

  // ─── Sample Order ─────────────────────────────────────────────
  await prisma.order.create({
    data: {
      restaurantId: restaurant.id,
      orderNumber: 'ORD-DEMO001',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      subtotal: 520,
      tax: 26,
      total: 546,
      customerName: 'Jane Doe',
      tableNumber: '5',
      items: {
        create: [
          { itemId: items[0].id, quantity: 2, unitPrice: 120, totalPrice: 240 },
          { itemId: items[3].id, quantity: 2, unitPrice: 120, totalPrice: 240 },
          { itemId: items[1].id, quantity: 1, unitPrice: 80, totalPrice: 80 },
        ],
      },
    },
  });
  console.log('✅ Sample order created');

  console.log('\n🎉 Seed complete!');
  console.log('📧 Login: demo@armenu.com');
  console.log('🔑 Password: Password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
