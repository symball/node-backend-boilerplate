import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import { parse } from 'yaml'
import swaggerUi from 'swagger-ui-express'
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, ROUTER_SWAGGER_ENABLE } from '@libs/config'
import { Routes } from '@interfaces/routes.interface'
import errorMiddleware from '@middlewares/error.middleware'
import { logger, stream } from '@libs/logger'
import { readFileSync } from 'fs'
import getDbClient from '@libs/prisma'

class App {
    public app: express.Application
    private server
    private port: number

    constructor(routes: Routes[]) {
        this.app = express()
        logger.debug(`Environment: ${NODE_ENV}`)

        this.initializeMiddlewares()
        this.initializeRoutes(routes)
        if (ROUTER_SWAGGER_ENABLE) {
            this.initializeSwagger()
        }
        this.initializeErrorHandling()
    }

    public listen() {
        this.server = this.app.listen(PORT, () => {
            logger.info(`Listening on port ${PORT}`)
        })
    }

    public getServer() {
        return this.app
    }

    public async onShutdown() {
        await this.server.close()
        logger.debug('Server Closed')
        await getDbClient().$disconnect()
        logger.debug('DB Disconnected')
    }

    private initializeMiddlewares() {
        this.app.use(morgan(LOG_FORMAT, { stream }))
        this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }))
        this.app.use(hpp())
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cookieParser())
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
            logger.debug(`Init ${route.constructor.name} routes`)
            this.app.use('/', route.router)
        })
    }

    private initializeSwagger() {
        logger.debug('Exposing API docs')
        const swaggerObject = parse(readFileSync('./openapi.yaml', 'utf8'))
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerObject))
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware)
    }
}

export default App
