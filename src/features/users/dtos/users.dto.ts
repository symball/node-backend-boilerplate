import { array, enums, Infer, object, string } from 'superstruct'
import { Prisma } from '@prisma/client'
import { Email } from '@libs/superstruct.defines'
import { UserRole } from '@features/users/lib/enums'

export const UserCreate = object({
    email: Email,
    password: string(),
    roles: array(enums([UserRole.NORMAL, UserRole.ADMIN]))
})
export type UserCreateType = Infer<typeof UserCreate>;

export const userPrivateFields = {
    id: true,
    email: true,
    roles: true
} satisfies Prisma.UserSelect

export type userPrivateType = Prisma.UserGetPayload<{ select: typeof userPrivateFields }>

export const userPublicFields = {
    id: true,
    roles: true
} satisfies Prisma.UserSelect
export type userPublicType = Prisma.UserGetPayload<{ select: typeof userPublicFields }>
