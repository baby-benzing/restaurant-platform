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

  // Create Pavé46 restaurant
  const pave46 = await prisma.restaurant.create({
    data: {
      slug: 'pave46',
      name: 'Pavé46',
      description: 'An intimate neighborhood cocktail bar in Hudson Square, blending Parisian charm with impeccable service. Discover curated wines, craft cocktails, and refined small plates in a setting that captures the essence of both New York and Paris.',
      logo: '/images/pave46-logo.png',
    },
  });

  console.log('✅ Created Pavé46 restaurant');

  // Create menus
  const mainMenu = await prisma.menu.create({
    data: {
      restaurantId: pave46.id,
      name: 'Main Menu',
      description: 'Our curated selection of cocktails, wines, and small plates',
      sortOrder: 1,
      isActive: true,
      sections: {
        create: [
          {
            name: 'Signature Cocktails',
            description: 'Crafted with care and creativity',
            sortOrder: 1,
            items: {
              create: [
                {
                  name: 'Le Boulevardier',
                  description: 'Rye whiskey, Campari, sweet vermouth',
                  price: 16,
                  sortOrder: 1,
                },
                {
                  name: 'French 75',
                  description: 'Gin, lemon juice, simple syrup, champagne',
                  price: 15,
                  sortOrder: 2,
                },
                {
                  name: 'Sazerac',
                  description: 'Cognac, absinthe, sugar cube, Peychaud\'s bitters',
                  price: 17,
                  sortOrder: 3,
                },
              ],
            },
          },
          {
            name: 'Wine Selection',
            description: 'Carefully selected wines from France and beyond',
            sortOrder: 2,
            items: {
              create: [
                {
                  name: 'Sancerre, Domaine Vacheron',
                  description: '2022, Loire Valley, France',
                  price: 14,
                  sortOrder: 1,
                },
                {
                  name: 'Châteauneuf-du-Pape, Domaine du Vieux Télégraphe',
                  description: '2019, Rhône Valley, France',
                  price: 18,
                  sortOrder: 2,
                },
                {
                  name: 'Champagne, Pierre Gimonnet & Fils',
                  description: 'Brut, Cuis 1er Cru, NV',
                  price: 16,
                  sortOrder: 3,
                },
              ],
            },
          },
          {
            name: 'Small Plates',
            description: 'Perfect accompaniments to your drinks',
            sortOrder: 3,
            items: {
              create: [
                {
                  name: 'Cheese Board',
                  description: 'Selection of three artisanal cheeses, honey, crackers',
                  price: 24,
                  sortOrder: 1,
                },
                {
                  name: 'Charcuterie',
                  description: 'Cured meats, cornichons, mustard, baguette',
                  price: 22,
                  sortOrder: 2,
                },
                {
                  name: 'Oysters',
                  description: 'Half dozen, mignonette, lemon',
                  price: 18,
                  sortOrder: 3,
                },
                {
                  name: 'Steak Frites',
                  description: 'Hanger steak, herb butter, pommes frites',
                  price: 28,
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
    { dayOfWeek: 0, openTime: '17:00', closeTime: '00:00', isClosed: false }, // Sunday
    { dayOfWeek: 1, openTime: '17:00', closeTime: '00:00', isClosed: false }, // Monday
    { dayOfWeek: 2, openTime: '17:00', closeTime: '00:00', isClosed: false }, // Tuesday
    { dayOfWeek: 3, openTime: '17:00', closeTime: '01:00', isClosed: false }, // Wednesday
    { dayOfWeek: 4, openTime: '17:00', closeTime: '01:00', isClosed: false }, // Thursday
    { dayOfWeek: 5, openTime: '17:00', closeTime: '02:00', isClosed: false }, // Friday
    { dayOfWeek: 6, openTime: '17:00', closeTime: '02:00', isClosed: false }, // Saturday
  ];

  for (const hour of hours) {
    await prisma.operatingHours.create({
      data: {
        ...hour,
        restaurantId: pave46.id,
      },
    });
  }

  console.log('✅ Created operating hours');

  // Create contacts
  const contacts = [
    { type: 'phone', value: '(212) 555-0146', label: 'Reservations' },
    { type: 'email', value: 'info@pave46.com', label: 'General Inquiries' },
    { type: 'address', value: '181 Hudson Street, New York, NY 10013', label: 'Location' },
    { type: 'social', value: '@pave46nyc', label: 'Instagram' },
  ];

  for (let i = 0; i < contacts.length; i++) {
    await prisma.contact.create({
      data: {
        ...contacts[i],
        sortOrder: i + 1,
        restaurantId: pave46.id,
      },
    });
  }

  console.log('✅ Created contact information');

  // Create images
  const images = [
    { url: '/images/pave46-hero.jpg', alt: 'Pavé46 interior', category: 'hero' },
    { url: '/images/pave46-bar.jpg', alt: 'Bar area', category: 'gallery' },
    { url: '/images/pave46-cocktail.jpg', alt: 'Signature cocktail', category: 'gallery' },
    { url: '/images/pave46-dining.jpg', alt: 'Dining area', category: 'gallery' },
  ];

  for (let i = 0; i < images.length; i++) {
    await prisma.image.create({
      data: {
        ...images[i],
        sortOrder: i + 1,
        restaurantId: pave46.id,
      },
    });
  }

  console.log('✅ Created images');

  // Create test users
  const users = [
    {
      email: 'admin@pave46.com',
      name: 'Admin User',
      role: 'admin',
      passwordHash: await hash('admin123', 10),
    },
    {
      email: 'editor@pave46.com',
      name: 'Editor User',
      role: 'editor',
      passwordHash: await hash('editor123', 10),
    },
    {
      email: 'viewer@pave46.com',
      name: 'Viewer User',
      role: 'viewer',
      passwordHash: await hash('viewer123', 10),
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