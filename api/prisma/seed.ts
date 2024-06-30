import { PrismaClient, Prisma } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { settings } from "../globals/settings";
const prisma = new PrismaClient();

const categoryData: Prisma.CategoryCreateInput[] = [
  {
    name: "Appetizers",
    descr: "funny description",
    display_order: 1,
    items: {
      create: [
        {
          name: "Frech fries",
          descr: "yum",
          available: true,
          display_order: 1,
          priceEUR: 500,
        },
        {
          name: "Salad",
          descr: "yum",
          available: true,
          display_order: 2,
          priceEUR: 700,
        },
        {
          name: "Secret Sauce",
          descr: "yum",
          available: false,
          display_order: 3,
          priceEUR: 1000,
        },
      ],
    },
  },
  {
    name: "Drinks",
    descr: "funny description",
    display_order: 3,
    items: {
      create: [
        {
          name: "Orange Juice",
          descr: "yum",
          available: true,
          display_order: 1,
          priceEUR: 512,
        },
        {
          name: "Coffe",
          descr: "yum",
          available: true,
          display_order: 2,
          priceEUR: 754,
        },
        {
          name: "Beer",
          descr: "yum",
          available: true,
          display_order: 3,
          priceEUR: 1250,
        },
      ],
    },
  },
  {
    name: "Main Dishes",
    descr: "funny description",
    display_order: 2,
    items: {
      create: [
        {
          name: "Burger",
          descr: "juicy",
          available: true,
          display_order: 1,
          priceEUR: 5049,
        },
        {
          name: "Steak",
          descr: "rib eye",
          available: true,
          display_order: 2,
          priceEUR: 7654,
        },
        {
          name: "Pasta",
          descr: "yum",
          available: false,
          display_order: 3,
          priceEUR: 4300,
        },
      ],
    },
  },
];

async function seedCategoriesAndItems(data: Prisma.CategoryCreateInput[]) {
  for (const dato of data) {
    await prisma.category.create({ data: dato });
  }
}

async function seedUser(username: string, password: string) {
  const salt = await bcryptjs.genSalt();
  const hashedPassword = await bcryptjs.hash(password, salt);

  await prisma.merchant.create({
    data: {
      email: `${settings.seedInitialUsername}@${settings.seedInitialUsername}.com`,
      password: hashedPassword,
      name: username,
      is_admin: true,
    },
  });
}

async function main() {
  console.log(`Start seeding ...`);

  if (!settings.seedInitialUsername || !settings.seedInitialPassword) {
    console.log(`Seeding failed`);
    console.log(`No environmental variables were set for SEED_INITIAL_USERNAME or SEED_INITIAL_USERNAME`);
    return;
  }

  // delete existing
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.user.deleteMany();

  seedCategoriesAndItems(categoryData);
  seedUser(settings.seedInitialUsername, settings.seedInitialPassword);

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
