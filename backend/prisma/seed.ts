import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Roles
  const roles = [
    { name: 'Super Admin' },
    { name: 'Admin' },
    { name: 'Technician' },
    { name: 'Guest' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
  }

  const superAdminRole = await prisma.role.findUnique({ where: { name: 'Super Admin' } });
  const technicianRole = await prisma.role.findUnique({ where: { name: 'Technician' } });

  if (!superAdminRole || !technicianRole) {
    throw new Error('Roles not created properly');
  }

  // 2. Super Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@example.com',
      password: adminPassword,
      roleId: superAdminRole.id,
      status: 'active'
    }
  });

  // 3. Technician User
  const techPassword = await bcrypt.hash('tech123', 10);
  await prisma.user.upsert({
    where: { email: 'tech@example.com' },
    update: {},
    create: {
      name: 'Technician Ravi',
      email: 'tech@example.com',
      password: techPassword,
      roleId: technicianRole.id,
      status: 'active'
    }
  });

  // 4. Categories
  const categories = [
    { name: 'Tempered / Glass Guard' },
    { name: 'Touch / OCA Glass' },
    { name: 'Folder / Display / Combo' },
    { name: 'Display Connector' },
    { name: 'Frame / Middle Frame' },
    { name: 'Back Cover' },
    { name: 'Battery List' },
    { name: 'Power Volume Flex' },
    { name: 'Charging Sub Board' }
  ];

  const categoryMap: Record<string, any> = {};
  for (const cat of categories) {
    const createdCat = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    });
    categoryMap[cat.name] = createdCat;
  }

  // 5. Brands
  const brands = [
    { name: 'VIVO', logoUrl: 'https://logo.clearbit.com/vivo.com' },
    { name: 'REDMI', logoUrl: 'https://logo.clearbit.com/mi.com' },
    { name: 'REALME', logoUrl: 'https://logo.clearbit.com/realme.com' },
    { name: 'SAMSUNG', logoUrl: 'https://logo.clearbit.com/samsung.com' },
    { name: 'ITEL', logoUrl: 'https://logo.clearbit.com/itel-mobile.com' },
    { name: 'LAVA', logoUrl: 'https://logo.clearbit.com/lavamobiles.com' }
  ];

  const brandMap: Record<string, any> = {};
  for (const brand of brands) {
    const createdBrand = await prisma.brand.upsert({
      where: { name: brand.name },
      update: {},
      create: brand
    });
    brandMap[brand.name] = createdBrand;
  }

  // 6. Models & Compatibility
  const vivoBrand = brandMap['VIVO'];
  const displayConnectorCat = categoryMap['Display Connector'];
  const batteryCat = categoryMap['Battery List'];

  const seedModels = [
    {
      name: 'Vivo V11',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'Standard display connector compatibility. Verify notch alignment.',
      aliases: ['Vivo V11 Pro', 'Vivo Z3i'],
      tags: ['Display', 'Notch', 'V11'],
      compatibility: [
        { compatibleWith: 'Vivo V11i', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Z3i', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y97', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Z3', connectorType: '30-pin', type: 'Display', isVerified: true }
      ]
    },
    {
      name: 'Vivo V28',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'Display connector matches mid-range Y series.',
      aliases: ['V28', 'Y73 Match'],
      tags: ['Display', 'V28'],
      compatibility: [
        { compatibleWith: 'Vivo Y73', connectorType: '40-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo V23e 5G', connectorType: '40-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y75 4G', connectorType: '40-pin', type: 'Display', isVerified: true }
      ]
    },
    {
      name: 'Vivo Y19',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'Uses multi-compatible display connector.',
      aliases: ['Y19', 'U20 Match'],
      tags: ['Display', 'Y19'],
      compatibility: [
        { compatibleWith: 'Vivo U20', connectorType: '34-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y5s', connectorType: '34-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo U3x', connectorType: '34-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'IQOO Z5i', connectorType: '34-pin', type: 'Display', isVerified: true }
      ]
    },
    {
      name: 'Vivo Y79',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'Legacy screen/connector setup.',
      aliases: ['Y79', 'V7 Plus Match'],
      tags: ['Display', 'Y79'],
      compatibility: [
        { compatibleWith: 'Vivo V7 Plus', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y79a', connectorType: '30-pin', type: 'Display', isVerified: true }
      ]
    },
    {
      name: 'Vivo S1',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'Super AMOLED screen connector.',
      aliases: ['S1', 'Z1x Match'],
      tags: ['Display', 'S1'],
      compatibility: [
        { compatibleWith: 'Vivo S1 Pro', connectorType: '50-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Z1x', connectorType: '50-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y7s', connectorType: '50-pin', type: 'Display', isVerified: true }
      ]
    },
    {
      name: 'Vivo Y81',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'Widely compatible model in budget range.',
      aliases: ['Y81', 'Y91 Match'],
      tags: ['Display', 'Y81'],
      compatibility: [
        { compatibleWith: 'Vivo Y81i', connectorType: '34-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y90', connectorType: '34-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y91c', connectorType: '34-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y93', connectorType: '34-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y95', connectorType: '34-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y1s', connectorType: '34-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo U1', connectorType: '34-pin', type: 'Display', isVerified: true }
      ]
    },
    {
      name: 'Vivo Y9',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'Medium tier model compatibility.',
      aliases: ['Y9', 'Y85 Match'],
      tags: ['Display', 'Y9'],
      compatibility: [
        { compatibleWith: 'Vivo Y9 Youth', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y9 Pro', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y85', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Z1', connectorType: '30-pin', type: 'Display', isVerified: true }
      ]
    },
    {
      name: 'Vivo Y71',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'Budget legacy connector.',
      aliases: ['Y71', 'Y71i Match'],
      tags: ['Display', 'Y71'],
      compatibility: [
        { compatibleWith: 'Vivo Y71i', connectorType: '28-pin', type: 'Display', isVerified: true }
      ]
    },
    {
      name: 'Vivo Y200 5G',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'Modern 5G AMOLED connector.',
      aliases: ['Y200', 'T3 Match'],
      tags: ['Display', '5G', 'Y200'],
      compatibility: [
        { compatibleWith: 'Vivo T3', connectorType: '40-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y300', connectorType: '40-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y200e', connectorType: '40-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'IQOO Z6 5G', connectorType: '40-pin', type: 'Display', isVerified: true }
      ]
    },
    {
      name: 'Vivo V17',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'V series AMOLED display connector.',
      aliases: ['V17', 'V19 Match'],
      tags: ['Display', 'V17'],
      compatibility: [
        { compatibleWith: 'Vivo V19neo', connectorType: '40-pin', type: 'Display', isVerified: true }
      ]
    },
    {
      name: 'Vivo Z1 Pro',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'Punch-hole screen connector.',
      aliases: ['Z1 Pro', 'Z5x Match'],
      tags: ['Display', 'Z1 Pro'],
      compatibility: [
        { compatibleWith: 'Vivo Z5x', connectorType: '34-pin', type: 'Display', isVerified: true }
      ]
    },
    {
      name: 'Vivo Y11',
      brandId: vivoBrand.id,
      categoryId: displayConnectorCat.id,
      isVerified: true,
      notes: 'Widely interchangeable screen among Y series.',
      aliases: ['Y11', 'Y12 Match', 'Y15 Match'],
      tags: ['Display', 'Y11'],
      compatibility: [
        { compatibleWith: 'Vivo Y12', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y15', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y15s', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y17', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo U10', connectorType: '30-pin', type: 'Display', isVerified: true },
        { compatibleWith: 'Vivo Y3', connectorType: '30-pin', type: 'Display', isVerified: true }
      ]
    }
  ];

  for (const m of seedModels) {
    const createdModel = await prisma.model.create({
      data: {
        name: m.name,
        brandId: m.brandId,
        categoryId: m.categoryId,
        isVerified: m.isVerified,
        notes: m.notes,
        aliases: {
          create: m.aliases.map(a => ({ aliasName: a }))
        },
        tags: {
          create: m.tags.map(t => ({ tagName: t }))
        }
      }
    });

    for (const c of m.compatibility) {
      await prisma.compatibilityList.create({
        data: {
          modelId: createdModel.id,
          compatibleWith: c.compatibleWith,
          connectorType: c.connectorType,
          type: c.type,
          isVerified: c.isVerified
        }
      });
    }
  }

  // 7. Some mock keywords for popular searches
  const keywords = ['vivo v11', 'iphone 12', 'samsung s21', 'battery', 'display connector'];
  for (const kw of keywords) {
    await prisma.searchKeyword.upsert({
      where: { keyword: kw },
      update: { count: { increment: 10 } },
      create: { keyword: kw, count: 10 }
    });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
