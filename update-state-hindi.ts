import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.village.updateMany({
    where: {
      state: 'Rajasthan',
    },
    data: {
      state: 'राजस्थान',
    },
  });

  console.log(`Updated ${result.count} villages to use Hindi state name.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
