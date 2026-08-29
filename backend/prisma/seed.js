const { PrismaClient } = require("@prisma/client");
const { SCHEMES } = require("../src/data/schemes");

const prisma = new PrismaClient();

async function main() {
  for (const s of SCHEMES) {
    await prisma.scheme.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        purpose: s.purpose,
        categories: s.categories,
        eligibility: s.eligibility,
        supportType: s.supportType,
        applicationPointer: s.applicationPointer,
        verification: s.verification,
      },
      create: s,
    });
  }
  console.log(`Seeded ${SCHEMES.length} government schemes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
