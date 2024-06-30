import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { settings } from "../globals";
import { updateExchangeRates } from "../services";

const prisma = new PrismaClient();

async function seedUser(name: string, apiKey: string) {
  const salt = await bcryptjs.genSalt();
  const hashedApiKey = await bcryptjs.hash(apiKey, salt);

  await prisma.user.create({
    data: {
      name: name,
      apiKey: hashedApiKey,
    },
  });
}

async function main() {
  console.log(`Start seeding ...`);

  // delete existing
  await prisma.user.deleteMany();
  await prisma.exchangeRates.deleteMany();

  await seedUser(settings.seedInitialUser, settings.seedInitialApiKey);
  await updateExchangeRates(prisma);

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
