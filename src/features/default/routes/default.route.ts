import { Router } from 'express'
import DefaultController from '@features/default/controllers/default.controller'
import { Routes } from '@interfaces/routes.interface'

class DefaultRoute implements Routes {
    public path = '/'
    public router: Router = Router()
    public indexController = new DefaultController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.indexController.index)
    }
}

export default DefaultRoute
