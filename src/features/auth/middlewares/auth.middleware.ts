import { NextFunction, RequestHandler, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { AUTH_PARAMETER_KEY, AUTH_PARAMETER_PREFIX, AUTH_SECRET_KEY } from '@libs/config'
import { HttpException } from '@exceptions/HttpException'
import { DataStoredInToken, RequestWithUser } from '@features/auth/interfaces/auth.interface'
import { UserRole } from '@features/users/lib/enums'

export const authMiddleware = (roleRequired: string = UserRole.NORMAL): RequestHandler => {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const Authorization =
                req.cookies[AUTH_PARAMETER_KEY] ||
                (req.header(AUTH_PARAMETER_KEY) ? req.header(AUTH_PARAMETER_KEY)?.split(`${AUTH_PARAMETER_PREFIX} `)[1] : null)

            if (Authorization) {
                const verificationResponse = (await verify(Authorization, AUTH_SECRET_KEY)) as DataStoredInToken
                const userId = verificationResponse.id
                const users = new PrismaClient().user
                const findUser = await users.findUnique({ where: { id: userId } })

                if (findUser) {
                    req.user = findUser
                    if(findUser.roles.includes(roleRequired)) {
                        next()
                    } else {
                        next(new HttpException(403, 'Unauthorized access'))
                    }
                } else {
                    next(new HttpException(401, 'Wrong authentication token'))
                }
            } else {
                next(new HttpException(401, 'Authentication token missing'))
            }
        } catch (error) {
            next(new HttpException(401, 'Wrong authentication token'))
        }
    }
}

