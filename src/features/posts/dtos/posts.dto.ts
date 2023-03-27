import { boolean, Infer, object, optional, string } from 'superstruct'
import { Prisma } from '@prisma/client'
import { Slug } from '@libs/superstruct.defines'
import { userPublicFields } from '@features/users/dtos/users.dto'

export const PostEdit = object({
    title: string(),
    slug: Slug,
    content: string(),
    published: boolean(),
})

export const postPrivateFields = {
    id: true,
    title: true,
    slug: true,
    content: true,
    created_at: true,
    updated_at: true,
    published: true,
} satisfies Prisma.PostSelect

export type PostEditType = Infer<typeof PostEdit>;
export type postPrivate = Prisma.PostGetPayload<{ select: typeof postPrivateFields }>

export const postPrivateListingFields = {
    id: true,
    title: true,
    slug: true,
    created_at: true,
    updated_at: true,
    published: true,
    author: {
        select: userPublicFields
    }
} satisfies Prisma.PostSelect
export type postPrivateListing = Prisma.PostGetPayload<{ select: typeof postPrivateListingFields }>

export const postPublicFields = {
    id: true,
    title: true,
    slug: true,
    content: true,
    created_at: true,
    updated_at: true,
    author: {
        select: userPublicFields
    }
} satisfies Prisma.PostSelect
export type postPublic = Prisma.PostGetPayload<{ select: typeof postPublicFields }>// const postPublicValidator = Prisma.validator<Prisma.PostArgs>()({ select: postPublicFields })

export const postPublicListingFields = {
    id: true,
    title: true,
    slug: true,
    author: {
        select: userPublicFields
    }
} satisfies Prisma.PostSelect
export type postPublicListing = Prisma.PostGetPayload<{ select: typeof postPublicListingFields }>


