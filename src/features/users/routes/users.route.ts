import { Router } from 'express'
import UsersController from '@features/users/controllers/users.controller'
import { Routes } from '@interfaces/routes.interface'
import validationMiddleware from '@middlewares/validation.middleware'
import { UserCreate } from '@features/users/dtos/users.dto'
import * as auth from '@features/auth/middlewares/auth.middleware'
import { UserRole } from '@features/users/lib/enums'
import UsersAdminController from '@features/users/controllers/users.admin.controller'
import { ROUTER_ADMIN_PREFIX } from '@libs/config'

class UsersRoute implements Routes {
    public path = '/users'
    public router: Router = Router()
    public usersController = new UsersController()
    public usersAdminController = new UsersAdminController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, auth.authMiddleware(), this.usersController.getUser)
        this.router.put(`${this.path}`, auth.authMiddleware(), validationMiddleware(UserCreate, 'body'), this.usersController.updateUser)
        this.router.get(`${this.path}/:id`, this.usersController.getUserByid)

        this.router.get(`${ROUTER_ADMIN_PREFIX}${this.path}`, auth.authMiddleware(UserRole.ADMIN), this.usersAdminController.getUsers)
        this.router.post(`${ROUTER_ADMIN_PREFIX}${this.path}`, auth.authMiddleware(UserRole.ADMIN), validationMiddleware(UserCreate, 'body'), this.usersAdminController.createUser)
        this.router.put(`${ROUTER_ADMIN_PREFIX}${this.path}/:id`, auth.authMiddleware(UserRole.ADMIN), validationMiddleware(UserCreate, 'body'), this.usersAdminController.updateUser)
        this.router.delete(`${ROUTER_ADMIN_PREFIX}${this.path}/:id`, auth.authMiddleware(UserRole.ADMIN), this.usersAdminController.deleteUser)
    }
}

export default UsersRoute
