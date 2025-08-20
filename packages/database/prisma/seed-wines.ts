import { PrismaClient, WineType, WineInventoryStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedWines() {
  console.log('Seeding wine list for Noreetuh...');

  // Get Noreetuh restaurant
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: 'noreetuh' },
  });

  if (!restaurant) {
    console.error('Noreetuh restaurant not found. Please seed restaurant data first.');
    return;
  }

  // Sample wine data
  const wines = [
    // Red Wines
    {
      name: 'Pinot Noir',
      producer: 'Hirsch Vineyards',
      vintage: 2021,
      region: 'Sonoma Coast',
      country: 'USA',
      grapeVarieties: ['Pinot Noir'],
      type: WineType.RED,
      glassPrice: 18,
      bottlePrice: 72,
      tastingNotes: 'Elegant with notes of cherry, earth, and spice',
      foodPairings: ['Grilled salmon', 'Roasted pork', 'Mushroom dishes'],
      inventoryStatus: WineInventoryStatus.IN_STOCK,
      featured: true,
    },
    {
      name: 'Cabernet Sauvignon',
      producer: 'Silver Oak',
      vintage: 2019,
      region: 'Alexander Valley',
      country: 'USA',
      grapeVarieties: ['Cabernet Sauvignon'],
      type: WineType.RED,
      glassPrice: 22,
      bottlePrice: 95,
      tastingNotes: 'Bold and structured with blackberry and vanilla notes',
      foodPairings: ['Rib eye steak', 'Aged cheeses'],
      inventoryStatus: WineInventoryStatus.IN_STOCK,
    },
    {
      name: 'Malbec',
      producer: 'Catena Zapata',
      vintage: 2020,
      region: 'Mendoza',
      country: 'Argentina',
      grapeVarieties: ['Malbec'],
      type: WineType.RED,
      glassPrice: 14,
      bottlePrice: 55,
      tastingNotes: 'Rich and velvety with plum and chocolate flavors',
      foodPairings: ['Grilled meats', 'BBQ'],
      inventoryStatus: WineInventoryStatus.IN_STOCK,
    },

    // White Wines
    {
      name: 'Riesling',
      producer: 'Dr. Loosen',
      vintage: 2022,
      region: 'Mosel',
      country: 'Germany',
      grapeVarieties: ['Riesling'],
      type: WineType.WHITE,
      glassPrice: 12,
      bottlePrice: 45,
      tastingNotes: 'Crisp and refreshing with peach and citrus notes',
      foodPairings: ['Spicy dishes', 'Seafood', 'Asian cuisine'],
      inventoryStatus: WineInventoryStatus.IN_STOCK,
      featured: true,
    },
    {
      name: 'Sauvignon Blanc',
      producer: 'Cloudy Bay',
      vintage: 2023,
      region: 'Marlborough',
      country: 'New Zealand',
      grapeVarieties: ['Sauvignon Blanc'],
      type: WineType.WHITE,
      glassPrice: 13,
      bottlePrice: 48,
      tastingNotes: 'Vibrant with grapefruit and tropical fruit flavors',
      foodPairings: ['Fresh oysters', 'Goat cheese', 'Green salads'],
      inventoryStatus: WineInventoryStatus.IN_STOCK,
    },
    {
      name: 'Chardonnay',
      producer: 'Kistler',
      vintage: 2021,
      region: 'Sonoma Coast',
      country: 'USA',
      grapeVarieties: ['Chardonnay'],
      type: WineType.WHITE,
      glassPrice: 20,
      bottlePrice: 85,
      tastingNotes: 'Complex with apple, pear, and subtle oak',
      foodPairings: ['Lobster', 'Creamy pasta', 'Roasted chicken'],
      inventoryStatus: WineInventoryStatus.LOW_STOCK,
    },

    // Rosé
    {
      name: 'Côtes de Provence Rosé',
      producer: 'Château Miraval',
      vintage: 2023,
      region: 'Provence',
      country: 'France',
      grapeVarieties: ['Grenache', 'Cinsault', 'Syrah'],
      type: WineType.ROSE,
      glassPrice: 15,
      bottlePrice: 58,
      tastingNotes: 'Dry and elegant with strawberry and citrus notes',
      foodPairings: ['Grilled fish', 'Salads', 'Light appetizers'],
      inventoryStatus: WineInventoryStatus.IN_STOCK,
    },

    // Sparkling
    {
      name: 'Champagne Brut',
      producer: 'Pol Roger',
      vintage: null,
      region: 'Champagne',
      country: 'France',
      grapeVarieties: ['Chardonnay', 'Pinot Noir', 'Pinot Meunier'],
      type: WineType.SPARKLING,
      glassPrice: 24,
      bottlePrice: 110,
      tastingNotes: 'Fine bubbles with brioche and citrus complexity',
      foodPairings: ['Oysters', 'Caviar', 'Fried foods'],
      inventoryStatus: WineInventoryStatus.IN_STOCK,
      featured: true,
    },
    {
      name: 'Prosecco',
      producer: 'Bisol',
      vintage: null,
      region: 'Valdobbiadene',
      country: 'Italy',
      grapeVarieties: ['Glera'],
      type: WineType.SPARKLING,
      glassPrice: 11,
      bottlePrice: 42,
      tastingNotes: 'Light and fruity with green apple and pear',
      foodPairings: ['Antipasti', 'Light seafood', 'Brunch'],
      inventoryStatus: WineInventoryStatus.IN_STOCK,
    },

    // Natural/Orange wines (trendy for modern restaurants)
    {
      name: 'Skin Contact White',
      producer: 'Radikon',
      vintage: 2020,
      region: 'Friuli',
      country: 'Italy',
      grapeVarieties: ['Ribolla Gialla'],
      type: WineType.WHITE,
      glassPrice: 16,
      bottlePrice: 65,
      tastingNotes: 'Complex orange wine with tannic grip and dried fruit',
      foodPairings: ['Charcuterie', 'Hard cheeses', 'Roasted vegetables'],
      inventoryStatus: WineInventoryStatus.IN_STOCK,
    },
  ];

  // Insert wines
  for (const wine of wines) {
    await prisma.wine.create({
      data: {
        ...wine,
        restaurantId: restaurant.id,
        displayOrder: wines.indexOf(wine),
      },
    });
  }

  console.log(`Seeded ${wines.length} wines for Noreetuh restaurant`);
}

seedWines()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });