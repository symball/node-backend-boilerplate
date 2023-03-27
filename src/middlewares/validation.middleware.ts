import { RequestHandler } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { assert, is } from 'superstruct'
import slug from 'slug'


const validationMiddleware = (type: any, value: string | 'body' | 'query' | 'params' = 'body'): RequestHandler => {
    return (req, res, next) => {
        try {
            assert(req[value], type)
            next()
        } catch (error) {

            // If we are just missing a slug, try and generate from title
            if(error.key == 'slug' && 'title' in req[value]) {
                req[value].slug = slug(req[value].title)
                if(is(req[value], type)) {
                    return next()
                }
            }

            next(new HttpException(400, `${error.key}: should be ${error.type}`))
        }
    }
}

export default validationMiddleware
