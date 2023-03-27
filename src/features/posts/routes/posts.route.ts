import { Router } from 'express'
import { Routes } from '@interfaces/routes.interface'
import validationMiddleware from '@middlewares/validation.middleware'
import { PostEdit } from '@features/posts/dtos/posts.dto'
import PostsController from '@features/posts/controllers/posts.controller'
import * as auth from '@features/auth/middlewares/auth.middleware'
import { ROUTER_ADMIN_PREFIX } from '@libs/config'
import { UserRole } from '@features/users/lib/enums'
import PostsAdminController from '@features/posts/controllers/posts.admin.controller'

export default class PostsRoute implements Routes {
    public path = '/posts'
    public router: Router = Router()
    public postsController = new PostsController()
    public postsAdminController = new PostsAdminController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.postsController.getPosts)
        this.router.get(`${this.path}/my`, auth.authMiddleware(), this.postsController.getPostsByCurrentUser)
        this.router.get(`${this.path}/:slug`, this.postsController.getPostBySlug)
        this.router.get(`${this.path}/user/:id`, this.postsController.getPostsByUser)
        this.router.get(`${this.path}/my/:slug`, auth.authMiddleware(), this.postsController.getPostByCurrentUser)
        this.router.post(`${this.path}`, auth.authMiddleware(), validationMiddleware(PostEdit, 'body'), this.postsController.createPost)
        this.router.put(`${this.path}/:slug`, auth.authMiddleware(), validationMiddleware(PostEdit, 'body'), this.postsController.updatePost)
        this.router.delete(`${this.path}/:slug`, auth.authMiddleware(), this.postsController.deletePost)
        this.router.get(`${ROUTER_ADMIN_PREFIX}${this.path}`, auth.authMiddleware(UserRole.ADMIN), this.postsAdminController.getPosts)
        this.router.get(`${ROUTER_ADMIN_PREFIX}${this.path}/:slug`, auth.authMiddleware(UserRole.ADMIN), this.postsAdminController.getPostBySlug)
        this.router.get(`${ROUTER_ADMIN_PREFIX}${this.path}/user/:uuid`, auth.authMiddleware(UserRole.ADMIN), this.postsAdminController.getPostsByUser)
        this.router.put(`${ROUTER_ADMIN_PREFIX}${this.path}/:slug`, auth.authMiddleware(UserRole.ADMIN), validationMiddleware(PostEdit, 'body'), this.postsAdminController.updatePost)
        this.router.delete(`${ROUTER_ADMIN_PREFIX}${this.path}/:slug`, auth.authMiddleware(UserRole.ADMIN), this.postsAdminController.deletePost)
    }
}
