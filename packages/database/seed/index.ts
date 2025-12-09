import { PrismaClient } from "../generated/client";
import { database } from "index";
import { seedUsers } from "./users";

async function main() {
    console.log('Starting database seeding...')

    // Seed in order of dependencies
    await seedUsers(database);

    console.log('Database seeding completed!')
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e)
        process.exit(1)    
    })
    .finally(async () => {
        await database.$disconnect()
    })