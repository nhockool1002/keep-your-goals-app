import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcryptjs";
import { logger } from "../src/utils/logger";

const prisma = new PrismaClient();

async function main() {
    logger.info("Fr NestJS [Seeding] started.");

    // Hash password function
    const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

    // Tạo User cụ thể với password đã mã hóa
    await prisma.user.create({
        data: {
            username: "goals999",
            email: "goals999@example.com",
            passwordHash: hashPassword("goals999"),
            themePreference: "light",
        },
    });
    logger.info("Fr NestJS [Seeding user goals999]: User goals999 created.");

    // Tạo Users ngẫu nhiên với password đã mã hóa
    const users = await prisma.user.createMany({
        data: Array.from({ length: 5 }, () => ({
            username: faker.internet.username(),
            email: faker.internet.email(),
            passwordHash: hashPassword(faker.internet.password()),
            themePreference: faker.helpers.arrayElement(["light", "dark"]),
        })),
    });
    logger.info("Fr NestJS [Seeding random user]: ", { count: 5 });

    // Tạo Subscriptions
    const subscriptions = await prisma.subscription.createMany({
        data: [
            { name: "Free", maxGoals: 5, price: 0, durationDays: 30 },
            { name: "Pro", maxGoals: 50, price: 9.99, durationDays: 30 },
        ],
    });
    logger.info("Fr NestJS [Seeding Subscriptions] completed.");

    // Lấy danh sách Users và Subscriptions
    const allUsers = await prisma.user.findMany();
    const allSubscriptions = await prisma.subscription.findMany();

    // Tạo UserSubscriptions
    for (const user of allUsers) {
        await prisma.userSubscription.create({
            data: {
                userId: user.id,
                subscriptionId: faker.helpers.arrayElement(allSubscriptions).id,
                startDate: new Date(),
                endDate: faker.date.future(),
                isActive: true,
            },
        });
    }
    logger.info("Fr NestJS [Seeding UserSubscriptions] completed.");

    // Tạo Goals
    const goals = await prisma.goal.createMany({
        data: allUsers.map(user => ({
            userId: user.id,
            type: faker.helpers.arrayElement(["DoSomething", "Quantity", "Financial"]),
            title: faker.lorem.words(3),
            description: faker.lorem.sentence(),
            startDate: faker.date.past(),
            endDate: faker.date.future(),
            status: faker.helpers.arrayElement(["Planning", "InProgress", "Done", "Failed"]),
        })),
    });
    logger.info("Fr NestJS [Seeding Goals] completed.");

    // Tạo Goal Labels
    const labels = await prisma.goalLabel.createMany({
        data: [
            { name: "Health" },
            { name: "Finance" },
            { name: "Education" },
        ],
    });
    logger.info("Fr NestJS [Seeding Goal Labels] completed.");

    // Lấy danh sách Goals và Labels
    const allGoals = await prisma.goal.findMany();
    const allLabels = await prisma.goalLabel.findMany();

    // Gán Labels cho Goals
    for (const goal of allGoals) {
        await prisma.goal.update({
            where: { id: goal.id },
            data: {
                labels: {
                    connect: [{ id: faker.helpers.arrayElement(allLabels).id }],
                },
            },
        });
    }
    logger.info("Fr NestJS [Seeding Assign Label to Goal] completed.");

    logger.info("Fr NestJS [Seeding] completed.");
}

main()
    .catch(e => {
        logger.error(`Fr NestJS [Seeding] failed, ${e.message}`, { error: e });
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
