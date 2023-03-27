import { NextFunction, Request, Response } from 'express'
import { User } from '@prisma/client'
import { RequestWithUser } from '@features/auth/interfaces/auth.interface'
import AuthService from '@features/auth/services/auth.service'
import { UserSecurityType } from '@features/auth/dtos/auth.dto'

class AuthController {
    public authService = new AuthService()

    public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: UserSecurityType = req.body
            const signUpUserData: User = await this.authService.signup(userData)

            res.status(201).json({ data: signUpUserData, message: 'signup' })
        } catch (error) {
            next(error)
        }
    }

    public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: UserSecurityType = req.body
            const { cookie, loginUser } = await this.authService.login(userData)

            res.setHeader('Set-Cookie', [cookie])
            res.status(200).json({ data: loginUser, message: 'login' })
        } catch (error) {
            next(error)
        }
    }

    public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.setHeader('Set-Cookie', ['Authorization=; Max-age=0'])
            res.status(200).json({ message: 'logout' })
        } catch (error) {
            next(error)
        }
    }
}

export default AuthController
