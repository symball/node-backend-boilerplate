import { NextFunction, Request, Response } from 'express'
import UserService  from '@features/users/services/users.service'
import { UserCreateType, userPublicType } from '@features/users/dtos/users.dto'

class UsersAdminController {
    public userService = new UserService()

    public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const usersData: userPublicType[] = await this.userService.findAllUser()
            res.status(200).json({ data: usersData, message: 'findAll' })
        } catch (error) {
            next(error)
        }
    }

    public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: UserCreateType = req.body
            const createUserData: userPublicType = await this.userService.createUser(userData)

            res.status(201).json({ data: createUserData, message: 'created' })
        } catch (error) {
            next(error)
        }
    }

    public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id
            const userData: UserCreateType = req.body
            const updateUserData: userPublicType = await this.userService.updateUser(userId, userData)

            res.status(200).json({ data: updateUserData, message: 'updated' })
        } catch (error) {
            next(error)
        }
    }

    public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id
            const deleteUserData: userPublicType = await this.userService.deleteUser(userId)

            res.status(200).json({ data: deleteUserData, message: 'deleted' })
        } catch (error) {
            next(error)
        }
    }
}

export default UsersAdminController
