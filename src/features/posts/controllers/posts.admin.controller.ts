import { NextFunction, Request, Response } from 'express'
import { logger } from '@libs/logger'
import PostService from '@features/posts/services/posts.service'
import {
    postPublicFields,
    postPublic,
    postPublicListingFields,
    postPrivate,
    PostEditType,
    postPrivateFields, postPublicListing, postPrivateListingFields, postPrivateListing
} from '@features/posts/dtos/posts.dto'
import {
    PrismaDeleteOptions,
    PrismaSelectManyOptions,
    PrismaSelectOptions,
    PrismaUpdateOptions
} from '@features/posts/libs/types'
import { POSTS_PER_PAGE } from '@libs/config'
import { Order } from '@/prisma/libs'
import { isType } from '@libs/validation'
import { RequestWithUser } from '@features/auth/interfaces/auth.interface'
import { Post } from '@prisma/client'

export default class PostsAdminController {
    public postService = new PostService()

    public getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Parameter parsing
            const cursorId:string = req.query.cursor_post_id as string || ''
            const order:Order = isType(req.query.order as string, Order) as Order || Order.DESCENDING

            // Processing
            const posts = await this.postService.getPostsByCursor({
                take: POSTS_PER_PAGE,
                orderBy: { created_at: order },
                cursor: { id: cursorId },
                select: postPrivateListingFields
            }) as postPrivateListing[]

            // Output
            const meta:any = {}
            if(posts.length > 0) {
                meta.first_post_id = posts.at(0)?.id
                meta.last_post_id = posts.at(-1)?.id
            }
            res.status(200).json({ data: posts, meta, message: 'getPosts'})
        } catch (error) {
            next(error)
        }
    }

    public getPostBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Input
            const postSlug = req.params.slug

            // Processing
            const post = await this.postService.findPost({
                select: postPrivateFields,
                where: { slug: postSlug }
            }) as postPrivate

            // Output
            res.status(200).json({ data: post, message: 'getPostBySlug' })
        } catch (error) {
            next(error)
        }
    }

    public getPostsByUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Parameter parsing
            const userId = req.user.id
            const cursorId:string = req.query.cursor_post_id as string || ''
            const order:Order = isType(req.query.order as string, Order) as Order || Order.DESCENDING

            // Processing
            const posts = await this.postService.getPostsByCursor({
                take: POSTS_PER_PAGE,
                orderBy: { created_at: order },
                cursor: { id: cursorId },
                select: postPrivateListingFields,
                where: {
                    author_id: userId,
                }
            }) as postPrivateListing[]

            // Output
            const meta:any = {}
            if(posts.length > 0) {
                meta.first_post_id = posts.at(0)
                meta.last_post_id = posts.at(-1)
            }
            res.status(200).json({ data: posts, meta, message: 'getPostsByUser'})

        } catch (error) {
            next(error)
        }
    }

    public updatePost = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Input
            const postSlug = req.params.slug
            const postData: PostEditType = req.body

            // Processing
            const post = await this.postService.updatePost({
                select: postPrivateFields,
                data: { postData },
                where: {
                    slug: postSlug,
                }
            }) as postPrivate

            // Output
            res.status(200).json({ data: post, message: 'updatePost' })
        } catch (error) {
            next(error)
        }
    }

    public deletePost = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Input
            const postSlug = req.params.slug

            // Processing
            const post = await this.postService.deletePost({
                where: {
                    slug: postSlug
                }
            }) as postPrivate

            // Output
            res.status(200).json({ data: post, message: 'deletePost' })
        } catch (error) {
            next(error)
        }
    }
}
