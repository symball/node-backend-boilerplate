import { hash } from 'bcrypt'
import { PrismaClient, User } from '@prisma/client'
import { UserCreateType, userPublicFields, userPublicType } from '@features/users/dtos/users.dto'
import { HttpException } from '@exceptions/HttpException'
import { AUTH_SALT_ROUNDS } from '@libs/config'
import getDbClient from '@libs/prisma'

class UserService {
    public users = getDbClient().user

    public async findAllUser(): Promise<userPublicType[]> {
        const allUser: userPublicType[] = await this.users.findMany({ select: userPublicFields })
        return allUser
    }

    public async findUserByid(userId: string): Promise<userPublicType> {
        const findUser: userPublicType | null = await this.users.findUnique({
            where: { id: userId },
            select: userPublicFields }
        )
        if (!findUser) throw new HttpException(409, 'User doesn\'t exist')

        return findUser
    }

    public async createUser(userData: UserCreateType): Promise<userPublicType> {
        const findUser: userPublicType | null = await this.users.findUnique({ where: { email: userData.email }, select: userPublicFields })
        if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`)

        const hashedPassword = await hash(userData.password, AUTH_SALT_ROUNDS)
        const createUserData: userPublicType = await this.users.create({
            data: { ...userData, password: hashedPassword },
            select: userPublicFields,
        })
        return createUserData
    }

    public async updateUser(userId: string, userData: UserCreateType): Promise<userPublicType> {
        const findUser: User | null = await this.users.findUnique({ where: { id: userId } })
        if (!findUser) throw new HttpException(409, 'User doesn\'t exist')

        const hashedPassword = await hash(userData.password, AUTH_SALT_ROUNDS)
        const updateUserData: userPublicType = await this.users.update({
            where: { id: findUser.id },
            data: { ...userData, password: hashedPassword },
            select: userPublicFields,
        })
        return updateUserData
    }

    public async deleteUser(userId: string): Promise<userPublicType> {
        const findUser: userPublicType | null = await this.users.findUnique({ where: { id: userId }, select: userPublicFields })
        if (!findUser) throw new HttpException(409, 'User doesn\'t exist')

        const deleteUserData = await this.users.delete({ where: { id: findUser.id } })
        return deleteUserData
    }
}

export default UserService
