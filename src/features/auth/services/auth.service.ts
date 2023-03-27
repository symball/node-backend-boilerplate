import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { User } from '@prisma/client'
import { AUTH_SALT_ROUNDS, AUTH_SECRET_KEY, AUTH_TOKEN_LIFETIME_MINUTES } from '@libs/config'
import { HttpException } from '@exceptions/HttpException'
import { DataStoredInToken, TokenData } from '@features/auth/interfaces/auth.interface'
import { UserSecurityType } from '@features/auth/dtos/auth.dto'
import getDbClient from '@libs/prisma'
import { UserRole } from '@features/users/lib/enums'
import { userPrivateFields, userPrivateType, userPublicFields, userPublicType } from '@features/users/dtos/users.dto'

class AuthService {
    public users = getDbClient().user

    public async signup(userData: UserSecurityType): Promise<User> {
        const findUser: User | null = await this.users.findUnique({ where: { email: userData.email } })
        if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`)

        const hashedPassword = await hash(userData.password, AUTH_SALT_ROUNDS)
        const user = await this.users.create({ data: { ...userData, password: hashedPassword, roles: [UserRole.NORMAL] } })
        return user
    }

    public async login(userData: UserSecurityType): Promise<{ cookie: string; loginUser: userPrivateType }> {
        const findUser: User | null = await this.users.findUnique({ where: { email: userData.email }})
        if (!findUser) throw new HttpException(401, 'Wrong Username / Password')

        const { password, ...loginUser } = findUser
        const isPasswordMatching: boolean = await compare(userData.password, password)
        if (!isPasswordMatching) throw new HttpException(401, 'Wrong Username / Password')

        const tokenData = this.createToken(loginUser)
        const cookie = this.createCookie(tokenData)

        return { cookie, loginUser }
    }

    public createToken(user: userPrivateType): TokenData {
        const dataStoredInToken: DataStoredInToken = { id: user.id }
        const secretKey: string = AUTH_SECRET_KEY
        const expiresIn: number = AUTH_TOKEN_LIFETIME_MINUTES * 60

        return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) }
    }

    public createCookie(tokenData: TokenData): string {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`
    }

    public async updateUserPassword(userId: string, password: string): Promise<userPublicType> {
        const findUser: User | null = await this.users.findUnique({ where: { id: userId } })
        if (!findUser) throw new HttpException(409, 'User doesn\'t exist')

        const hashedPassword = await hash(password, AUTH_SALT_ROUNDS)
        const updateUserData: userPublicType = await this.users.update({
            where: { id: findUser.id },
            data: { password: hashedPassword },
            select: userPublicFields,
        })
        return updateUserData
    }
}

export default AuthService
