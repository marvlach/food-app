import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { settings } from "../globals";
const prisma = new PrismaClient();

async function seedUser(name: string, apiKey: string) {
  await prisma.user.create({
    data: {
      name: name,
      apiKey: apiKey,
    },
  });
}

async function main() {
  console.log(`Start seeding ...`);

  // delete existing
  await prisma.user.deleteMany();
  await prisma.exchangeRates.deleteMany();

  seedUser(settings.seedInitialUser, settings.seedInitialApiKey);

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
