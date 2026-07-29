import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Wiping all mock data...');
  
  // Wipe members and families
  await prisma.member.deleteMany({});
  await prisma.family.deleteMany({});
  
  // Wipe posts, notifications, etc.
  await prisma.feedPost.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.advertisement.deleteMany({});

  // Reset village counts to 0
  await prisma.village.updateMany({
    data: {
      familyCount: 0,
      memberCount: 0,
    },
  });

  // Sync village adminName with the actual User table
  const villageAdmins = await prisma.user.findMany({
    where: { role: 'village_admin', villageId: { not: null } },
  });

  for (const admin of villageAdmins) {
    if (admin.villageId) {
      await prisma.village.update({
        where: { id: admin.villageId },
        data: { adminName: admin.name },
      });
    }
  }

  console.log('Cleaned up successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
