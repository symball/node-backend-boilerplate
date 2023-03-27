import { Router } from 'express'
import AuthController from '@features/auth/controllers/auth.controller'
import { Routes } from '@interfaces/routes.interface'
import * as auth from '@features/auth/middlewares/auth.middleware'

import validationMiddleware from '@middlewares/validation.middleware'
import { UserSecurity } from '@features/auth/dtos/auth.dto'

class AuthRoute implements Routes {
    public path = '/'
    public router: Router = Router()
    public authController = new AuthController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post(`${this.path}signup`, validationMiddleware(UserSecurity, 'body'), this.authController.signUp)
        this.router.post(`${this.path}login`, validationMiddleware(UserSecurity, 'body'), this.authController.logIn)
        this.router.get(`${this.path}logout`, auth.authMiddleware(), this.authController.logOut)
    }
}

export default AuthRoute
