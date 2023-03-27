import { Prisma } from '@prisma/client'
import getDbClient from '../../../libs/prisma'
import {
    PostEditType,
    postPublicFields,
    postPublic,
    postPrivateListing,
    postPrivate,
    postPrivateFields,
    postPublicListing,
} from '@features/posts/dtos/posts.dto'
import { HttpException } from '@exceptions/HttpException'
import {
    PrismaDeleteOptions,
    PrismaSelectManyOptions, PrismaSelectOptions,
    PrismaUpdateOptions
} from '@features/posts/libs/types'
import { logger } from '@libs/logger'

const posts = getDbClient().post

class PostService {
    public posts = getDbClient().post

    public async getPostsByCursor(queryOptions:PrismaSelectManyOptions): Promise<Array<postPrivateListing|postPublicListing>> {
        // Only prepare cursor properties if it has a value
        let options
        if(Object.values(queryOptions.cursor)[0]) {
            options = { ...queryOptions, skip: 1 }
        } else {
            const { cursor, ...strippedOptions } = queryOptions
            options = strippedOptions
        }

        // @ts-expect-error Compiler thinks type cannot satisfy Posts. Selected limited fields in query
        return this.posts.findMany(options)
    }

    public async findPost(queryOptions: Prisma.PostFindFirstArgsBase): Promise<postPrivate|postPublic> {

        const findPost: postPublic|postPrivate | null = await this.posts.findFirst(queryOptions)
        if (!findPost) throw new HttpException(404, 'Post doesn\'t exist')
        return findPost
    }

    public async createPost(postData: PostEditType, userId:string): Promise<postPrivate> {
        try {
            await this.findPost({
                select: postPublicFields,
                where: { slug: postData.slug }
            })
            throw new HttpException(404, 'Post already exists')
        } catch (_error) {
            return this.posts.create({
                data: { ...postData, author: { connect: { id: userId }}},
                select: postPrivateFields
            })
        }
    }

    public async updatePost(queryOptions:PrismaUpdateOptions): Promise<postPrivate> {
        // Verify post actually exists
        const findPost = await this.findPost({ select: postPublicFields, where: queryOptions.where })

        // @ts-expect-error Compiler thinks type cannot satisfy Posts. Selected limited fields in query
        return this.posts.update({
            ...queryOptions,
            where: { id: findPost.id }
        })
    }

    public async deletePost(queryOptions:PrismaDeleteOptions): Promise<postPrivate> {
        // Verify post actually exists and get the ID so that multiple conditions can be used simply
        const findPost = await this.findPost({
            where: queryOptions.where, select: postPrivateFields })

        const deletePostData = await this.posts.delete({ where: { id: findPost.id }})
        // @ts-expect-error Compiler thinks type cannot satisfy Posts. Selected limited fields in query
        return findPost
    }
}

export default PostService
