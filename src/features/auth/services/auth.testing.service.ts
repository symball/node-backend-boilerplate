import bcrypt from 'bcrypt'
import { User } from '@prisma/client'
import { UserRole } from '@features/users/lib/enums'
import AuthService from '@features/auth/services/auth.service'
import { AUTH_PARAMETER_KEY, AUTH_PARAMETER_PREFIX, AUTH_SALT_ROUNDS } from '@libs/config'
import { RequestHandler } from 'express'
import { RequestWithUser } from '@features/auth/interfaces/auth.interface'

let instance

export class AuthTestingService {
    private authService = new AuthService()
    public password = 'testing'
    public user:User
    public header
    public token

    static async Create() {
        instance = new AuthTestingService()
        await instance.initializeUser()
        instance.generateTokens()
        return instance
    }

    private async initializeUser() {
        this.user = {
            id: '98c6eefe-d76d-4816-978c-8efb43a2446a',
            email: 'normal@email.com',
            password: await bcrypt.hash(this.password, AUTH_SALT_ROUNDS),
            roles: [UserRole.NORMAL, UserRole.ADMIN]
        }
    }

    private generateTokens() {
        this.token = this.authService.createToken(this.user).token
        this.header = {
            [AUTH_PARAMETER_KEY]: `${AUTH_PARAMETER_PREFIX} ${this.token}`
        }
    }
}

export const authTestMiddleware = ():RequestHandler => {
    return async (req:RequestWithUser, res, next) => {
        req.user = instance.user
        next()
    }
}
