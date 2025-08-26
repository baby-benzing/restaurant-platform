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
            category: 'BREADS',
            sortOrder: 1,
            items: {
              create: [
                {
                  name: 'Baguette',
                  description: '$2.5 Petit / $5 Full',
                  price: 5,
                  sortOrder: 1,
                },
                {
                  name: 'Multigrain',
                  description: 'Sunflower seeds, flax seeds, sesame, poppy seeds, millet. $5 Full Only',
                  price: 5,
                  sortOrder: 2,
                },
                {
                  name: 'Olive Ciabatta',
                  description: '$2.5 Petit Only',
                  price: 2.50,
                  sortOrder: 3,
                },
                {
                  name: 'Everything Baguette',
                  description: '',
                  price: 3.50,
                  sortOrder: 4,
                },
                {
                  name: 'Bread & Butter',
                  description: 'Warmed bread of your choice (baguette, multigrain, ciabatta) with a spread of salted bordier butter. $3.75 Petit Size',
                  price: 3.75,
                  sortOrder: 5,
                },
                {
                  name: 'Baguette & Comté',
                  description: 'Warmed petit baguette with Comté, brushed with butter',
                  price: 4.25,
                  sortOrder: 6,
                },
                {
                  name: 'Truffle Baguette',
                  description: 'Warmed petit baguette with truffle-mushroom sauce with salted bordier butter',
                  price: 8.50,
                  sortOrder: 7,
                },
              ],
            },
          },
          {
            name: 'Sandwiches',
            description: 'Made with our freshly baked breads',
            category: 'SANDWICHES',
            sortOrder: 2,
            items: {
              create: [
                {
                  name: 'Smoked Salmon',
                  description: 'Smoked Salmon on an everything baguette, whipped cream cheese, red onion, dill, capers. (+$4 for extra smoked salmon)',
                  price: 14,
                  sortOrder: 1,
                },
                {
                  name: 'Brie & Apple',
                  description: 'Brie and sliced apple on a petit baguette, arugula and honey-dijon (+$3 to add turkey)',
                  price: 11,
                  sortOrder: 2,
                },
                {
                  name: 'Jambon Beurre',
                  description: 'French ham on a petit baguette (full available), whole grain mustard and salted bordier butter (+$2 to add Comté)',
                  price: 8.50,
                  sortOrder: 3,
                },
                {
                  name: 'Country Pâté',
                  description: 'Country Pâté (pork & chicken liver) on a petit baguette with salted bordier butter and cornichon',
                  price: 9.75,
                  sortOrder: 4,
                },
                {
                  name: 'Saucisson Sec',
                  description: 'Sliced dry sausage (pork) on a petit multigrain with salted bordier butter and cornichon',
                  price: 8.75,
                  sortOrder: 5,
                },
                {
                  name: 'Caprese',
                  description: 'Plum tomatoes, mozzarella on a petit olive ciabatta (full baguette available) with basil pesto (contains nuts) (+$2 to add prosciutto)',
                  price: 8.50,
                  sortOrder: 6,
                },
                {
                  name: 'Pan Bagnat',
                  description: 'Tuna, plum tomato, kalamata olives, artichokes and sliced hard-boiled egg on a petit olive ciabatta bread',
                  price: 9.50,
                  sortOrder: 7,
                },
                {
                  name: 'Turkey Salad',
                  description: 'Roasted turkey, grapes, pistachios in classic mayo dressing on a croissant',
                  price: 13.50,
                  sortOrder: 8,
                },
                {
                  name: 'Raclette Melt',
                  description: 'Melted Raclette on a half baguette with cornichon (dine-in only) (+$4 to add prosciutto or ham)',
                  price: 16,
                  sortOrder: 9,
                },
                {
                  name: 'Croque Monsieur',
                  description: 'Melted Gruyere and béchamel with ham, dijon mustard on a sourdough bread',
                  price: 13,
                  sortOrder: 10,
                },
                {
                  name: 'Carottes Râpées',
                  description: 'Shredded carrots, whole grain mustard, lime (side dish)',
                  price: 7,
                  sortOrder: 11,
                },
                {
                  name: 'Avocado Toast',
                  description: 'Avocado mix atop slice of multigrain toast with sliced cherry tomatoes and chili flakes (+$2 to add soft or hard boiled egg)',
                  price: 13,
                  sortOrder: 12,
                },
              ],
            },
          },
          {
            name: 'Focaccia',
            description: 'Resembles a square pizza with topping that changes seasonally',
            category: 'FOCACCIA',
            sortOrder: 3,
            items: {
              create: [
                {
                  name: 'Mushroom-Potato',
                  description: 'Spread with crème fraîche, mushrooms, potatoes, and Gruyere cheese',
                  price: 6.75,
                  sortOrder: 1,
                },
                {
                  name: 'Chorizo-Zucchini',
                  description: 'Spread with tomato sauce, chorizo sausage, mozzarella, zucchini, and basil',
                  price: 6,
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            name: 'Soup & Salads',
            description: 'Fresh soups and salads',
            category: 'SOUP',
            sortOrder: 4,
            items: {
              create: [
                {
                  name: 'Green Salad',
                  description: 'Arugula, mesclun green mix, grapes, walnuts, Gruyere cheese, and hard-boiled egg are tossed in lemon vinaigrette (+$2 to add tuna or prosciutto, $3 to add turkey)',
                  price: 11,
                  sortOrder: 1,
                },
                {
                  name: 'Burrata Salad',
                  description: 'Burrata, arugula, basil pesto (contains nuts), pistachios with marinated tomatoes (+$2 to add prosciutto)',
                  price: 13,
                  sortOrder: 2,
                },
                {
                  name: 'Chilled Summer Corn Soup',
                  description: 'Grilled corn, basil pesto',
                  price: 9,
                  sortOrder: 3,
                },
              ],
            },
          },
          {
            name: 'Salads',
            description: 'Fresh seasonal salads',
            category: 'SALADS',
            sortOrder: 5,
            items: {
              create: [
                {
                  name: 'Green Salad',
                  description: 'Arugula, mesclun green mix, grapes, walnuts, Gruyere cheese, and hard-boiled egg are tossed in lemon vinaigrette (+$2 to add tuna or prosciutto, $3 to add turkey)',
                  price: 11,
                  sortOrder: 1,
                },
                {
                  name: 'Burrata Salad',
                  description: 'Burrata, arugula, basil pesto (contains nuts), pistachios with marinated tomatoes (+$2 to add prosciutto)',
                  price: 13,
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            name: 'Pastries',
            description: 'Sweet treats and baked goods',
            category: 'PASTRIES',
            sortOrder: 6,
            items: {
              create: [
                {
                  name: 'Banana Bread',
                  description: 'Loaf made with ripe bananas, toasted walnuts and cinnamon. $4.50 / $35 full loaf',
                  price: 4.50,
                  sortOrder: 1,
                },
                {
                  name: 'Maple Carrot Cake',
                  description: 'Loaf made with carrots, maple syrup, walnuts and raisins. $4.50 / $35 full loaf',
                  price: 4.50,
                  sortOrder: 2,
                },
                {
                  name: 'Marble Pound Cake',
                  description: 'Loaf made with bananas, eggs, and swirls of chocolate. $4.50 / $35 full loaf',
                  price: 4.50,
                  sortOrder: 3,
                },
                {
                  name: 'Financier',
                  description: 'A small French almond cake, flavored with beurre noisette',
                  price: 4.25,
                  sortOrder: 4,
                },
                {
                  name: 'Green Tea Scone',
                  description: 'Scone made with green tea and white chocolate',
                  price: 3,
                  sortOrder: 5,
                },
                {
                  name: 'Rosemary Sourdough Scone',
                  description: 'Multigrain sourdough, cranberries',
                  price: 3.25,
                  sortOrder: 6,
                },
                {
                  name: 'Salted Chocolate Sablé',
                  description: 'Salted chocolate "cookie" with more brittle texture',
                  price: 3.75,
                  sortOrder: 7,
                },
                {
                  name: 'Chocolate Chip Cookie',
                  description: '',
                  price: 3.50,
                  sortOrder: 8,
                },
                {
                  name: 'Brioche with Passionfruit Filling',
                  description: 'Brioche filled with passionfruit curd & studded with pearl sugar',
                  price: 4.50,
                  sortOrder: 9,
                },
                {
                  name: 'Vanilla Eclair',
                  description: '',
                  price: 5.50,
                  sortOrder: 10,
                },
                {
                  name: 'Paris-Brest Choux',
                  description: 'Pâte à choux with praline crème mousseline',
                  price: 6.50,
                  sortOrder: 11,
                },
                {
                  name: 'Lemon Madeleine',
                  description: '',
                  price: 2.75,
                  sortOrder: 12,
                },
                {
                  name: 'Almond Bostock',
                  description: 'Sliced brioche dipped in orange syrup and almond cream',
                  price: 4.75,
                  sortOrder: 13,
                },
                {
                  name: 'Chocolate Hazelnut Babka',
                  description: 'Chocolate, hazelnut, pecan. $5.25 / $16 full',
                  price: 5.25,
                  sortOrder: 14,
                },
                {
                  name: 'Canelés de Bordeaux',
                  description: '$4.50 Classic / $4.75 Matcha',
                  price: 4.50,
                  sortOrder: 15,
                },
              ],
            },
          },
          {
            name: 'Viennoiseries',
            description: 'French pastries',
            category: 'VIENNOISERIES',
            sortOrder: 7,
            items: {
              create: [
                {
                  name: 'Croissant',
                  description: '',
                  price: 4.75,
                  sortOrder: 1,
                },
                {
                  name: 'Pain au Chocolat',
                  description: '',
                  price: 5.25,
                  sortOrder: 2,
                },
                {
                  name: 'Almond Croissant',
                  description: '',
                  price: 6.25,
                  sortOrder: 3,
                },
              ],
            },
          },
          {
            name: 'Afternoon Menu',
            description: 'Available daily after 2pm',
            category: 'AFTERNOON_MENU',
            sortOrder: 8,
            items: {
              create: [
                {
                  name: 'Truffle Gougères',
                  description: 'Gruyère cheese choux filled with truffle-mushroom sauce',
                  price: 12,
                  sortOrder: 1,
                },
                {
                  name: 'Foie Gras Terrine',
                  description: 'On mini brioche, amarena cherry',
                  price: 25,
                  sortOrder: 2,
                },
                {
                  name: 'Cheese Plate',
                  description: 'Brie, gruyère, cheddar, dried apricots & figs',
                  price: 18,
                  sortOrder: 3,
                },
                {
                  name: 'Charcuterie Platter',
                  description: 'French ham, dried sausage, prosciutto, cornichon & olives',
                  price: 20,
                  sortOrder: 4,
                },
                {
                  name: 'Jambon Beurre',
                  description: 'French ham on a full baguette, mustard and salted bordier butter (+$6 to add Comté)',
                  price: 26,
                  sortOrder: 5,
                },
                {
                  name: 'Caprese',
                  description: 'Plum tomatoes, mozzarella on a full baguette with basil pesto (contains nuts) (+$6 to add prosciutto)',
                  price: 25,
                  sortOrder: 6,
                },
              ],
            },
          },
          {
            name: 'Wine',
            description: 'Curated wine selection',
            category: 'WINE',
            sortOrder: 9,
            items: {
              create: [
                {
                  name: 'Côtes du Rhône',
                  description: 'Medium-bodied red wine',
                  price: 45,
                  sortOrder: 1,
                },
                {
                  name: 'Sancerre',
                  description: 'Crisp white wine from Loire Valley',
                  price: 55,
                  sortOrder: 2,
                },
                {
                  name: 'Champagne Brut',
                  description: 'Classic French champagne',
                  price: 85,
                  sortOrder: 3,
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