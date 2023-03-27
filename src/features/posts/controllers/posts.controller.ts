import { NextFunction, Request, Response } from 'express'
import { logger } from '@libs/logger'
import PostService from '@features/posts/services/posts.service'
import {
    postPublicFields,
    postPublic,
    postPublicListingFields,
    postPrivateListingFields,
    postPrivateListing,
    postPrivate,
    PostEditType,
    postPrivateFields,
    postPublicListing
} from '@features/posts/dtos/posts.dto'
import { POSTS_PER_PAGE } from '@libs/config'
import { Order } from '@/prisma/libs'
import { isType } from '@libs/validation'
import { RequestWithUser } from '@features/auth/interfaces/auth.interface'

class PostsController {
    public postService = new PostService()

    public createPost = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Input
            const userId = req.user.id
            const postData: PostEditType = req.body

            // Processing
            const post:postPrivate = await this.postService.createPost(postData, userId)

            // Output
            res.status(200).json({ data: post, message: 'createPost' })
        } catch (error) {
            next(error)
        }
    }

    public getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Parameter parsing
            const cursorId:string = req.query.cursor_post_id as string || ''
            const order:Order = isType(req.query.order as string, Order) as Order || Order.DESCENDING

            // Processing
            const posts = await this.postService.getPostsByCursor({
                select: postPublicListingFields,
                take: POSTS_PER_PAGE,
                orderBy: { created_at: order },
                cursor: { id: cursorId },
                where: {
                    published: true,
                }
            }) as Array<postPublicListing>

            // Output
            const meta:any = {}
            if(posts.length > 0) {
                meta.first_post_id = posts.at(0)
                meta.last_post_id = posts.at(-1)
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
                select: postPublicFields,
                where: {
                    published: true,
                    slug: postSlug
                }
            }) as postPublic

            // Output
            res.status(200).json({ data: post, message: 'getPostBySlug' })
        } catch (error) {
            next(error)
        }
    }

    public getPostByCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Input
            const userId = req.user.id
            const postSlug = req.params.slug

            // Processing
            const post = await this.postService.findPost({
                select: postPrivateFields,
                where: {
                    author_id: userId,
                    slug: postSlug }
            }) as postPrivate

            // Output
            res.status(200).json({ data: post, message: 'getPostBySlug' })
        } catch (error) {
            next(error)
        }
    }
    public getPostsByCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
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
            }) as Array<postPrivateListing>

            // Output
            const meta:any = {}
            if(posts.length > 0) {
                meta.first_post_id = posts.at(0)
                meta.last_post_id = posts.at(-1)
            }
            res.status(200).json({ data: posts, meta, message: 'getPostsByCurrentUser'})
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
                select: postPublicListingFields,
                where: {
                    author_id: userId,
                }
            }) as Array<postPublicListing>

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
            const userId = req.user.id
            const postSlug = req.params.slug
            const postData: PostEditType = req.body

            // Processing
            const post:postPrivate = await this.postService.updatePost({
                select: postPrivateFields,
                data: postData,
                where: {
                    slug: postSlug,
                    author_id: userId,
                }
            })

            // Output
            res.status(200).json({ data: post, message: 'updatePost' })
        } catch (error) {
            next(error)
        }
    }

    public deletePost = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Input
            const userId = req.user.id
            const postSlug = req.params.slug

            // Processing
            const post:postPrivate = await this.postService.deletePost({
                where: {
                    slug: postSlug,
                    author_id: userId,
                }
            })

            // Output
            res.status(200).json({ data: post, message: 'deletePost' })
        } catch (error) {
            next(error)
        }
    }
}

export default PostsController
