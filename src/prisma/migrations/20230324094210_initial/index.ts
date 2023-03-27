import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { AUTH_SALT_ROUNDS } from '@libs/config'
import { UserRole } from '@features/users/lib/enums'

const migration = async (prisma: PrismaClient) => {
    const simon = await prisma.user.upsert({
        where: { email: 'contact@simonball.me' },
        update: {},
        create: {
            email: 'contact@simonball.me',
            password: await hash('development', AUTH_SALT_ROUNDS),
            roles: [UserRole.NORMAL, UserRole.ADMIN]
        },
    })

    const bob = await prisma.user.upsert({
        where: { email: 'bob@dylan.com' },
        update: {},
        create: {
            email: 'bob@dylan.com',
            password: await hash('not@applicable', AUTH_SALT_ROUNDS),
            roles: [UserRole.NORMAL]
        },
    })

    console.log({ simon, bob })

    const article1 = await prisma.post.upsert({
        where: { slug: 'first-post' },
        update: {},
        create: {
            title: 'First Post',
            slug: 'first-post',
            content: 'Here is a demonstration of seeding your posts',
            published: true,
            author_id: simon.id,
        },
    })
    const article2 = await prisma.post.upsert({
        where: { slug: 'second-post' },
        update: {},
        create: {
            title: 'Second Post',
            slug: 'second-post',
            content: 'Here is a demonstration of seeding your posts',
            published: true,
            author_id: simon.id,
        },
    })
    const article3 = await prisma.post.upsert({
        where: { slug: 'third-post' },
        update: {},
        create: {
            title: 'Third Post',
            slug: 'third-post',
            content: 'Here is a demonstration of seeding your posts',
            published: true,
            author_id: simon.id,
        },
    })
    console.log({ article1, article2, article3 })
}

export default migration
