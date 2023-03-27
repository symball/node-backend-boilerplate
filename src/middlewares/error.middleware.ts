import { NextFunction, Request, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { logger } from '@libs/logger'

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    try {
        const status: number = error.status || 500
        const message: string = error.message || 'Something went wrong'
        logger.debug(error)
        logger.error(`${req.method}:${req.path} -> Status: ${status}, Message: ${message}`)
        res.status(status).json({ message })
    } catch (error) {
        next(error)
    }
}

export default errorMiddleware
