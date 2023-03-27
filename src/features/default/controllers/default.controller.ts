import { NextFunction, Request, Response } from 'express'

class DefaultController {
    public index = (req: Request, res: Response, next: NextFunction): void => {
        try {
            res.status(200).json({ message: 'OK' })
        } catch (error) {
            next(error)
        }
    }
}

export default DefaultController
