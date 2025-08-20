import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.image.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.operatingHours.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuSection.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.restaurant.deleteMany();

  console.log('✅ Cleared existing data');

  // Create Pavé NYC restaurant
  const pave = await prisma.restaurant.create({
    data: {
      slug: 'pave',
      name: 'Pavé',
      description: 'A European-style café and bakery in Midtown Manhattan. Founded by Chef Jonghun Won, we believe there\'s nothing better than freshly baked bread, and that there\'s nothing better than a sandwich built on that bread. Fresh is best!',
      logo: '/images/pave-logo.png',
    },
  });

  console.log('✅ Created Pavé restaurant');

  // Create menus
  const mainMenu = await prisma.menu.create({
    data: {
      restaurantId: pave.id,
      name: 'Main Menu',
      description: 'Fresh breads, sandwiches, pastries and more',
      sortOrder: 1,
      isActive: true,
      sections: {
        create: [
          {
            name: 'Breads',
            description: 'Freshly baked artisanal breads',
            sortOrder: 1,
            items: {
              create: [
                {
                  name: 'Baguette',
                  description: 'Traditional French baguette',
                  price: 5,
                  sortOrder: 1,
                },
                {
                  name: 'Petit Baguette',
                  description: 'Half-size French baguette',
                  price: 2.50,
                  sortOrder: 2,
                },
                {
                  name: 'Multigrain',
                  description: 'Hearty multigrain loaf (Full size only)',
                  price: 5,
                  sortOrder: 3,
                },
                {
                  name: 'Olive Ciabatta',
                  description: 'Italian ciabatta with olives',
                  price: 2.50,
                  sortOrder: 4,
                },
                {
                  name: 'Everything Baguette',
                  description: 'Baguette with everything seasoning',
                  price: 3.50,
                  sortOrder: 5,
                },
              ],
            },
          },
          {
            name: 'Sandwiches',
            description: 'Made with our freshly baked breads',
            sortOrder: 2,
            items: {
              create: [
                {
                  name: 'Smoked Salmon',
                  description: 'Everything baguette, cream cheese, red onion',
                  price: 14,
                  sortOrder: 1,
                },
                {
                  name: 'Brie & Apple',
                  description: 'Petit baguette, arugula, honey-dijon',
                  price: 11,
                  sortOrder: 2,
                },
                {
                  name: 'Jambon Beurre',
                  description: 'French ham, mustard, butter',
                  price: 8.50,
                  sortOrder: 3,
                },
                {
                  name: 'Turkey Salad',
                  description: 'Croissant, grapes, pistachios',
                  price: 13.50,
                  sortOrder: 4,
                },
              ],
            },
          },
          {
            name: 'Focaccia',
            description: 'Italian flatbread with toppings',
            sortOrder: 3,
            items: {
              create: [
                {
                  name: 'Mushroom-Potato',
                  description: 'Crème fraîche, Gruyere',
                  price: 6.75,
                  sortOrder: 1,
                },
                {
                  name: 'Chorizo-Zucchini',
                  description: 'Tomato sauce, mozzarella',
                  price: 6,
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            name: 'Pastries & Viennoiserie',
            description: 'Sweet treats and French pastries',
            sortOrder: 4,
            items: {
              create: [
                {
                  name: 'Banana Bread',
                  description: 'Moist banana bread slice',
                  price: 4.50,
                  sortOrder: 1,
                },
                {
                  name: 'Financier',
                  description: 'French almond cake',
                  price: 4.25,
                  sortOrder: 2,
                },
                {
                  name: 'Green Tea Scone',
                  description: 'Delicate matcha-flavored scone',
                  price: 3,
                  sortOrder: 3,
                },
                {
                  name: 'Chocolate Chip Cookie',
                  description: 'Classic chocolate chip cookie',
                  price: 3.50,
                  sortOrder: 4,
                },
                {
                  name: 'Paris-Brest Choux',
                  description: 'Choux pastry with praline cream',
                  price: 6.50,
                  sortOrder: 5,
                },
              ],
            },
          },
          {
            name: 'Afternoon Menu',
            description: 'Available after 2pm',
            sortOrder: 5,
            items: {
              create: [
                {
                  name: 'Truffle Gougères',
                  description: 'Cheese puffs with truffle',
                  price: 12,
                  sortOrder: 1,
                },
                {
                  name: 'Foie Gras Terrine',
                  description: 'Duck liver terrine with toast points',
                  price: 25,
                  sortOrder: 2,
                },
                {
                  name: 'Cheese Plate',
                  description: 'Selection of artisanal cheeses',
                  price: 18,
                  sortOrder: 3,
                },
                {
                  name: 'Charcuterie Platter',
                  description: 'Cured meats and accompaniments',
                  price: 20,
                  sortOrder: 4,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Created menu with sections and items');

  // Create operating hours
  const hours = [
    { dayOfWeek: 0, openTime: '09:00', closeTime: '15:00', isClosed: false }, // Sunday
    { dayOfWeek: 1, openTime: '07:00', closeTime: '16:00', isClosed: false }, // Monday
    { dayOfWeek: 2, openTime: '07:00', closeTime: '19:00', isClosed: false }, // Tuesday
    { dayOfWeek: 3, openTime: '07:00', closeTime: '19:00', isClosed: false }, // Wednesday
    { dayOfWeek: 4, openTime: '07:00', closeTime: '19:00', isClosed: false }, // Thursday
    { dayOfWeek: 5, openTime: '07:00', closeTime: '16:00', isClosed: false }, // Friday
    { dayOfWeek: 6, openTime: '00:00', closeTime: '00:00', isClosed: true },   // Saturday - CLOSED
  ];

  for (const hour of hours) {
    await prisma.operatingHours.create({
      data: {
        ...hour,
        restaurantId: pave.id,
      },
    });
  }

  console.log('✅ Created operating hours');

  // Create contacts
  const contacts = [
    { type: 'phone', value: '(646) 454-1387', label: 'Phone' },
    { type: 'email', value: 'pavenyc@gmail.com', label: 'Email' },
    { type: 'address', value: '20 West 46th Street, New York, NY 10036', label: 'Location' },
    { type: 'social', value: '@pave_nyc', label: 'Instagram' },
  ];

  for (let i = 0; i < contacts.length; i++) {
    await prisma.contact.create({
      data: {
        ...contacts[i],
        sortOrder: i + 1,
        restaurantId: pave.id,
      },
    });
  }

  console.log('✅ Created contact information');

  // Create images
  const images = [
    { url: '/images/pave-hero.jpg', alt: 'Pavé bakery interior', category: 'hero' },
    { url: '/images/pave-breads.jpg', alt: 'Fresh baked breads', category: 'gallery' },
    { url: '/images/pave-pastries.jpg', alt: 'Pastry display', category: 'gallery' },
    { url: '/images/pave-sandwich.jpg', alt: 'Signature sandwich', category: 'gallery' },
  ];

  for (let i = 0; i < images.length; i++) {
    await prisma.image.create({
      data: {
        ...images[i],
        sortOrder: i + 1,
        restaurantId: pave.id,
      },
    });
  }

  console.log('✅ Created images');

  // Create test users
  const users = [
    {
      email: 'admin@pave.com',
      name: 'Admin User',
      role: 'ADMIN',
      passwordHash: await hash('AdminPassword123!', 10),
    },
    {
      email: 'editor@pave.com',
      name: 'Editor User',
      role: 'EDITOR',
      passwordHash: await hash('EditorPassword123!', 10),
    },
    {
      email: 'viewer@pave.com',
      name: 'Viewer User',
      role: 'VIEWER',
      passwordHash: await hash('ViewerPassword123!', 10),
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log('✅ Created test users');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });