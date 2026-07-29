import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.adPricing.createMany({
    data: [
      { product: 'community_featured', label: 'Community Featured', price: 1, durationDays: 30 },
      { product: 'village_featured', label: 'Village Featured', price: 1, durationDays: 30 },
      { product: 'community_listing', label: 'Community Listing', price: 1, durationDays: 30 },
    ],
    skipDuplicates: true,
  });

  await prisma.platformSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const shahpura = await prisma.village.create({
    data: {
      name: 'Shahpura',
      nameLocal: 'शाहपुरा',
      district: 'Bhilwara',
      state: 'Rajasthan',
      establishedYear: 1631,
      adminName: 'Ramesh Vishwakarma',
      description:
        'A heritage town known for its Phad paintings and generations of skilled artisan families.',
      coverImageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    },
  });

  const molela = await prisma.village.create({
    data: {
      name: 'Molela',
      nameLocal: 'मोलेला',
      district: 'Rajsamand',
      state: 'Rajasthan',
      establishedYear: 1750,
      adminName: 'Suresh Kumhar',
      description: 'Famous for terracotta plaque craftsmanship passed down through families.',
      coverImageUrl: 'https://images.unsplash.com/photo-1590766940554-153e57ba9315?w=800',
    },
  });

  const kishangarh = await prisma.village.create({
    data: {
      name: 'Kishangarh',
      nameLocal: 'किशनगढ़',
      district: 'Ajmer',
      state: 'Rajasthan',
      establishedYear: 1609,
      adminName: 'Manohar Lal',
      description: 'Known for miniature painting traditions and marble craftsmanship.',
      coverImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    },
  });

  const bassi = await prisma.village.create({
    data: {
      name: 'Bassi',
      nameLocal: 'बस्सी',
      district: 'Chittorgarh',
      state: 'Rajasthan',
      establishedYear: 1548,
      adminName: 'Ganesh Sharma',
      description: 'Wood carving and puppet-making artisan hub near Chittorgarh fort.',
      coverImageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    },
  });

  await prisma.village.create({
    data: {
      name: 'Pilani',
      nameLocal: 'पिलानी',
      district: 'Jhunjhunu',
      state: 'Rajasthan',
      establishedYear: 1900,
      adminName: 'Om Prakash',
      description: 'Educational town with a strong community of engineers and craftsmen.',
      coverImageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800',
    },
  });

  const sutharFamily = await prisma.family.create({
    data: { villageId: shahpura.id, headName: 'Suthar', address: 'Ward 4, Shahpura' },
  });

  const sutharHead = await prisma.member.create({
    data: {
      familyId: sutharFamily.id,
      villageId: shahpura.id,
      name: 'Ramlal Suthar',
      gender: 'male',
      age: 58,
      relation: 'Family Head',
      occupation: 'Carpenter',
      phone: '+91 98290 11111',
      isFamilyHead: true,
    },
  });

  await prisma.family.update({
    where: { id: sutharFamily.id },
    data: { headMemberId: sutharHead.id },
  });

  await prisma.member.createMany({
    data: [
      { familyId: sutharFamily.id, villageId: shahpura.id, name: 'Sita Devi', gender: 'female', age: 54, relation: 'Wife', occupation: 'Homemaker' },
      { familyId: sutharFamily.id, villageId: shahpura.id, name: 'Vikas Suthar', gender: 'male', age: 31, relation: 'Son', occupation: 'Engineer' },
      { familyId: sutharFamily.id, villageId: shahpura.id, name: 'Pooja Suthar', gender: 'female', age: 28, relation: 'Daughter-in-law', occupation: 'Teacher' },
      { familyId: sutharFamily.id, villageId: shahpura.id, name: 'Aarav Suthar', gender: 'male', age: 6, relation: 'Grandson' },
      { familyId: sutharFamily.id, villageId: shahpura.id, name: 'Kavita Suthar', gender: 'female', age: 26, relation: 'Daughter', occupation: 'Designer' },
    ],
  });

  const bhavsarFamily = await prisma.family.create({
    data: { villageId: shahpura.id, headName: 'Bhavsar', address: 'Ward 2, Shahpura' },
  });
  await prisma.member.create({
    data: {
      familyId: bhavsarFamily.id,
      villageId: shahpura.id,
      name: 'Mohan Bhavsar',
      gender: 'male',
      age: 47,
      relation: 'Family Head',
      occupation: 'Goldsmith',
      isFamilyHead: true,
    },
  });

  const kumharFamily = await prisma.family.create({
    data: { villageId: molela.id, headName: 'Kumhar', address: 'Main Road, Molela' },
  });
  await prisma.member.create({
    data: {
      familyId: kumharFamily.id,
      villageId: molela.id,
      name: 'Kishan Kumhar',
      gender: 'male',
      age: 60,
      relation: 'Family Head',
      occupation: 'Potter / Sculptor',
      isFamilyHead: true,
    },
  });

  const vishwakarmaFamily = await prisma.family.create({
    data: { villageId: kishangarh.id, headName: 'Vishwakarma', address: 'Station Road, Kishangarh' },
  });
  await prisma.member.create({
    data: {
      familyId: vishwakarmaFamily.id,
      villageId: kishangarh.id,
      name: 'Devendra Vishwakarma',
      gender: 'male',
      age: 55,
      relation: 'Family Head',
      occupation: 'Marble Artisan',
      isFamilyHead: true,
    },
  });

  // Recompute family/village member counts to match seeded rows

  await Promise.all(
    [shahpura, molela, kishangarh, bassi].map(async v => {
      const familyCount = await prisma.family.count({ where: { villageId: v.id } });
      const memberCount = await prisma.member.count({ where: { villageId: v.id } });
      await prisma.village.update({ where: { id: v.id }, data: { familyCount, memberCount } });
    }),
  );

  await prisma.notification.createMany({
    data: [
      {
        category: 'emergency',
        title: 'Blood Donation Needed',
        body: 'Urgent O-negative blood required at Bhilwara District Hospital. Contact village admin.',
        villageId: shahpura.id,
        priority: 'high',
      },
      {
        category: 'marriage',
        title: 'Vikas Suthar Wedding Invitation',
        body: 'The Suthar family cordially invites the community to the wedding ceremony on 2nd August.',
        villageId: shahpura.id,
        priority: 'normal',
      },
      {
        category: 'event',
        title: 'Vishwakarma Jayanti Celebrations',
        body: 'Join us for the annual Vishwakarma Jayanti celebration at the community hall.',
        villageId: molela.id,
        priority: 'normal',
      },
    ],
  });

  await prisma.feedPost.createMany({
    data: [
      {
        authorName: 'Ramesh Vishwakarma',
        villageId: shahpura.id,
        content:
          "Beautiful turnout at this year's Vishwakarma Jayanti in Shahpura. Grateful for the community spirit and the artisans who kept our traditions alive.",
        imageUrl: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800',
        likeCount: 42,
        commentCount: 8,
      },
      {
        authorName: 'Suresh Kumhar',
        villageId: molela.id,
        content:
          'Our Molela terracotta plaques are now being exhibited at the state crafts museum. Proud moment for the whole village.',
        likeCount: 63,
        commentCount: 11,
      },
    ],
  });

  await prisma.advertisement.createMany({
    data: [
      {
        title: 'Grand Opening: Vishwakarma Furniture Mart',
        businessName: 'Vishwakarma Furniture Mart',
        product: 'village_featured',
        status: 'live',
        villageId: shahpura.id,
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-07-31'),
      },
      {
        title: 'Sharma Marble Works — New Showroom',
        businessName: 'Sharma Marble Works',
        product: 'community_listing',
        status: 'pending_approval',
        villageId: bassi.id,
        price: 499,
      },
    ],
  });

  await prisma.user.create({
    data: {
      phone: '9876543210',
      email: 'admin@vishwakarma.com',
      password: 'password123', // In a real app this would be hashed
      name: 'Super Admin',
      role: 'super_admin',
      active: true,
    }
  });

  console.log('Seed complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
