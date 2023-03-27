import { Prisma } from '@prisma/client'

export type PrismaSelectManyOptions = {
    take: number,
    orderBy: any,
    cursor: any,
    where?: any,
    select: any
}

export type PrismaSelectOptions = {
    select: any,
    where: Prisma.PostWhereInput,
}

export type PrismaUpdateOptions = {
    select: any,
    data: any,
    where: any,
}

export type PrismaDeleteOptions = {
    where: any,
}
