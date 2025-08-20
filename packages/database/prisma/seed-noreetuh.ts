import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedNoreetuh() {
  console.log('Seeding Noreetuh restaurant data...');

  // Create Noreetuh restaurant
  const noreetuh = await prisma.restaurant.upsert({
    where: { slug: 'noreetuh' },
    update: {},
    create: {
      slug: 'noreetuh',
      name: 'Noreetuh',
      description: 'Modern Hawaiian cuisine with creative cocktails in a stylish setting',
      logo: '/images/noreetuh/logo.png',
    },
  });

  // Create admin user for Noreetuh
  const adminPassword = await bcrypt.hash('NoreetuhAdmin123!', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@noreetuh.com' },
    update: {},
    create: {
      email: 'admin@noreetuh.com',
      name: 'Noreetuh Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create menus
  const mainMenu = await prisma.menu.create({
    data: {
      restaurantId: noreetuh.id,
      name: 'Main Menu',
      description: 'Hawaiian-inspired dishes with local ingredients',
      sortOrder: 1,
      isActive: true,
    },
  });

  const cocktailMenu = await prisma.menu.create({
    data: {
      restaurantId: noreetuh.id,
      name: 'Cocktails',
      description: 'Tropical and classic cocktails',
      sortOrder: 2,
      isActive: true,
    },
  });

  // Create menu sections for main menu
  const snacksSection = await prisma.menuSection.create({
    data: {
      menuId: mainMenu.id,
      name: 'Snacks',
      description: 'Small plates to share',
      sortOrder: 1,
    },
  });

  const rawSection = await prisma.menuSection.create({
    data: {
      menuId: mainMenu.id,
      name: 'Raw',
      description: 'Fresh seafood preparations',
      sortOrder: 2,
    },
  });

  const mainsSection = await prisma.menuSection.create({
    data: {
      menuId: mainMenu.id,
      name: 'Mains',
      description: 'Larger format dishes',
      sortOrder: 3,
    },
  });

  const sidesSection = await prisma.menuSection.create({
    data: {
      menuId: mainMenu.id,
      name: 'Sides',
      description: 'To share',
      sortOrder: 4,
    },
  });

  const dessertsSection = await prisma.menuSection.create({
    data: {
      menuId: mainMenu.id,
      name: 'Desserts',
      description: 'Sweet endings',
      sortOrder: 5,
    },
  });

  // Create menu items for Snacks
  await prisma.menuItem.createMany({
    data: [
      {
        sectionId: snacksSection.id,
        name: 'Tuna Poke',
        description: 'Soy, sesame, scallion, macadamia nut',
        price: 19,
        sortOrder: 1,
        isAvailable: true,
      },
      {
        sectionId: snacksSection.id,
        name: 'Beef Jerky',
        description: 'Hawaiian style, li hing mui',
        price: 12,
        sortOrder: 2,
        isAvailable: true,
      },
      {
        sectionId: snacksSection.id,
        name: 'Spam Musubi',
        description: 'Nori, soy glaze',
        price: 8,
        sortOrder: 3,
        isAvailable: true,
      },
      {
        sectionId: snacksSection.id,
        name: 'Shrimp Chips',
        description: 'Kewpie mayo, furikake',
        price: 10,
        sortOrder: 4,
        isAvailable: true,
      },
    ],
  });

  // Create menu items for Raw
  await prisma.menuItem.createMany({
    data: [
      {
        sectionId: rawSection.id,
        name: 'Hawaiian Kanpachi',
        description: 'Coconut, lime, chili',
        price: 22,
        sortOrder: 1,
        isAvailable: true,
      },
      {
        sectionId: rawSection.id,
        name: 'Salmon Belly',
        description: 'Ikura, citrus, shiso',
        price: 20,
        sortOrder: 2,
        isAvailable: true,
      },
      {
        sectionId: rawSection.id,
        name: 'Scallop',
        description: 'Uni, caviar, champagne vinaigrette',
        price: 24,
        sortOrder: 3,
        isAvailable: true,
      },
      {
        sectionId: rawSection.id,
        name: 'Oysters',
        description: 'Half dozen, mignonette',
        price: 21,
        sortOrder: 4,
        isAvailable: true,
      },
    ],
  });

  // Create menu items for Mains
  await prisma.menuItem.createMany({
    data: [
      {
        sectionId: mainsSection.id,
        name: 'Whole Fish',
        description: 'Market fish, Hawaiian salt, herbs',
        price: 0, // Market price
        sortOrder: 1,
        isAvailable: true,
      },
      {
        sectionId: mainsSection.id,
        name: 'Pork Shoulder',
        description: 'Slow roasted, cabbage, mustard',
        price: 32,
        sortOrder: 2,
        isAvailable: true,
      },
      {
        sectionId: mainsSection.id,
        name: 'Rib Eye',
        description: 'Chimichurri, bone marrow',
        price: 65,
        sortOrder: 3,
        isAvailable: true,
      },
      {
        sectionId: mainsSection.id,
        name: 'Lobster',
        description: 'Grilled, garlic butter, herbs',
        price: 0, // Market price
        sortOrder: 4,
        isAvailable: true,
      },
    ],
  });

  // Create menu items for Sides
  await prisma.menuItem.createMany({
    data: [
      {
        sectionId: sidesSection.id,
        name: 'Rice',
        description: 'Steamed jasmine',
        price: 5,
        sortOrder: 1,
        isAvailable: true,
      },
      {
        sectionId: sidesSection.id,
        name: 'Mac Salad',
        description: 'Hawaiian style',
        price: 8,
        sortOrder: 2,
        isAvailable: true,
      },
      {
        sectionId: sidesSection.id,
        name: 'Grilled Vegetables',
        description: 'Seasonal selection',
        price: 12,
        sortOrder: 3,
        isAvailable: true,
      },
      {
        sectionId: sidesSection.id,
        name: 'Fries',
        description: 'Furikake, kewpie mayo',
        price: 10,
        sortOrder: 4,
        isAvailable: true,
      },
    ],
  });

  // Create menu items for Desserts
  await prisma.menuItem.createMany({
    data: [
      {
        sectionId: dessertsSection.id,
        name: 'Haupia',
        description: 'Coconut pudding, tropical fruit',
        price: 12,
        sortOrder: 1,
        isAvailable: true,
      },
      {
        sectionId: dessertsSection.id,
        name: 'Malasadas',
        description: 'Portuguese donuts, li hing mui sugar',
        price: 10,
        sortOrder: 2,
        isAvailable: true,
      },
      {
        sectionId: dessertsSection.id,
        name: 'Shave Ice',
        description: 'Condensed milk, azuki beans, mochi',
        price: 14,
        sortOrder: 3,
        isAvailable: true,
      },
    ],
  });

  // Create cocktail sections
  const classicSection = await prisma.menuSection.create({
    data: {
      menuId: cocktailMenu.id,
      name: 'Classic Cocktails',
      sortOrder: 1,
    },
  });

  const tropicalSection = await prisma.menuSection.create({
    data: {
      menuId: cocktailMenu.id,
      name: 'Tropical Cocktails',
      sortOrder: 2,
    },
  });

  // Create cocktail items
  await prisma.menuItem.createMany({
    data: [
      {
        sectionId: classicSection.id,
        name: 'Mai Tai',
        description: 'Rum, orgeat, lime, orange liqueur',
        price: 16,
        sortOrder: 1,
        isAvailable: true,
      },
      {
        sectionId: classicSection.id,
        name: 'Pisco Sour',
        description: 'Pisco, lime, egg white, bitters',
        price: 15,
        sortOrder: 2,
        isAvailable: true,
      },
      {
        sectionId: tropicalSection.id,
        name: 'Blue Hawaii',
        description: 'Vodka, rum, blue curacao, pineapple',
        price: 17,
        sortOrder: 1,
        isAvailable: true,
      },
      {
        sectionId: tropicalSection.id,
        name: 'Painkiller',
        description: 'Rum, pineapple, orange, coconut',
        price: 16,
        sortOrder: 2,
        isAvailable: true,
      },
    ],
  });

  // Create operating hours (dayOfWeek: 0=Sunday, 1=Monday, etc.)
  const hours = [
    { dayOfWeek: 1, openTime: '17:30', closeTime: '22:00' }, // Monday
    { dayOfWeek: 2, openTime: '17:30', closeTime: '22:00' }, // Tuesday
    { dayOfWeek: 3, openTime: '17:30', closeTime: '22:00' }, // Wednesday
    { dayOfWeek: 4, openTime: '17:30', closeTime: '23:00' }, // Thursday
    { dayOfWeek: 5, openTime: '17:30', closeTime: '23:00' }, // Friday
    { dayOfWeek: 6, openTime: '17:30', closeTime: '23:00' }, // Saturday
    { dayOfWeek: 0, openTime: '17:30', closeTime: '22:00' }, // Sunday
  ];

  for (const hour of hours) {
    await prisma.operatingHours.create({
      data: {
        restaurantId: noreetuh.id,
        ...hour,
        isClosed: false,
      },
    });
  }

  // Create contact information
  await prisma.contact.createMany({
    data: [
      {
        restaurantId: noreetuh.id,
        type: 'PHONE',
        label: 'Main',
        value: '(646) 892-3050',
        sortOrder: 1,
      },
      {
        restaurantId: noreetuh.id,
        type: 'EMAIL',
        label: 'General',
        value: 'info@noreetuh.com',
        sortOrder: 2,
      },
      {
        restaurantId: noreetuh.id,
        type: 'ADDRESS',
        label: 'Location',
        value: '128 First Avenue, New York, NY 10009',
        sortOrder: 3,
      },
      {
        restaurantId: noreetuh.id,
        type: 'SOCIAL',
        label: 'Instagram',
        value: 'https://www.instagram.com/noreetuh',
        sortOrder: 4,
      },
    ],
  });

  // Create images
  await prisma.image.createMany({
    data: [
      {
        restaurantId: noreetuh.id,
        url: '/images/noreetuh/hero.jpg',
        alt: 'Noreetuh interior',
        category: 'HERO',
        sortOrder: 1,
      },
      {
        restaurantId: noreetuh.id,
        url: '/images/noreetuh/poke.jpg',
        alt: 'Tuna poke bowl',
        category: 'FOOD',
        sortOrder: 2,
      },
      {
        restaurantId: noreetuh.id,
        url: '/images/noreetuh/cocktail.jpg',
        alt: 'Tropical cocktail',
        category: 'DRINKS',
        sortOrder: 3,
      },
      {
        restaurantId: noreetuh.id,
        url: '/images/noreetuh/interior.jpg',
        alt: 'Restaurant interior',
        category: 'INTERIOR',
        sortOrder: 4,
      },
    ],
  });

  console.log('Noreetuh restaurant data seeded successfully!');
}

seedNoreetuh()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });