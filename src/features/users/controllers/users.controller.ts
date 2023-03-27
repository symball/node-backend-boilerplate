import { NextFunction, Request, Response } from 'express'
import UserService  from '@features/users/services/users.service'
import { UserCreateType, userPublicType } from '@features/users/dtos/users.dto'
import { RequestWithUser } from '@features/auth/interfaces/auth.interface'

class UsersController {
    public userService = new UserService()

    public getUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Use object destructuring to get a stripped down version of the profile
            const { id, password, ...user } = req.user
            res.status(200).json({ data: user, message: 'getUser' })
        } catch (error) {
            next(error)
        }
    }

    public getUserByid = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id
            const findOneUserData: userPublicType = await this.userService.findUserByid(userId)
            res.status(200).json({ data: findOneUserData, message: 'findUser' })
        } catch (error) {
            next(error)
        }
    }

    public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user.id
            const userData: UserCreateType = req.body
            const updateUserData: userPublicType = await this.userService.updateUser(userId, userData)

            res.status(200).json({ data: updateUserData, message: 'updated' })
        } catch (error) {
            next(error)
        }
    }
}

export default UsersController
