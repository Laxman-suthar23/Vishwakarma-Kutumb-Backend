import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const retainId = 'cms62xcn000039kk9bj1neydp';

  // Find users that belong to the villages we are going to delete, and set their villageId to null to avoid foreign key constraint errors
  await prisma.user.updateMany({
    where: {
      villageId: { not: retainId },
    },
    data: {
      villageId: retainId,
    },
  });

  // Also move all families to the retained village to prevent foreign key errors
  await prisma.family.updateMany({
    where: {
      villageId: { not: retainId },
    },
    data: {
      villageId: retainId,
    },
  });

  // Also move all members
  await prisma.member.updateMany({
    where: {
      villageId: { not: retainId },
    },
    data: {
      villageId: retainId,
    },
  });

  // Delete all villages except the retained one
  const result = await prisma.village.deleteMany({
    where: {
      id: { not: retainId },
    },
  });

  console.log(`Deleted ${result.count} villages.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
