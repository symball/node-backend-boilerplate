import { PrismaClient } from '@prisma/client'

import initialMigration from './migrations/20230324094210_initial'

const prisma = new PrismaClient()

async function main() {
    await initialMigration(prisma)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })

    .catch(async e => {
        console.error(e)

        await prisma.$disconnect()

        process.exit(1)
    })
