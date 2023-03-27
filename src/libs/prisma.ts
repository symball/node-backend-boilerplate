import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const getDbClient = () => client



export default getDbClient
