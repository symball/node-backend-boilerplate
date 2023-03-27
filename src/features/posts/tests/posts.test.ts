import bcrypt from 'bcrypt'
import request from 'supertest'
import UserRoute from '@features/users/routes/users.route'
import { UserCreateType } from '@features/users/dtos/users.dto'
import { UserRole } from '@features/users/lib/enums'
import {
    authTestMiddleware,
    AuthTestingService,
} from '@features/auth/services/auth.testing.service'
import * as auth from '@features/auth/middlewares/auth.middleware'
import App from '@/app'
import { createSandbox } from 'sinon'
import { User } from '@prisma/client'
import { ROUTER_ADMIN_PREFIX } from '@libs/config'

let authTestService:AuthTestingService
const sandbox = createSandbox()

beforeAll(async() => {
    authTestService = await AuthTestingService.Create()
})
afterAll(sandbox.restore)

describe('Testing User Endpoints', () => {
    describe('Reject unauthorized', () => {
        it('rejects anonymous user', async () => {
            const usersRoute = new UserRoute()
            const app = new App([usersRoute])
            return request(app.getServer()).get(`${usersRoute.path}`).expect(401)
        })
    })
    describe('[GET] /users', () => {
        it('response findAll users', async () => {
            sandbox.stub(auth, 'authMiddleware').callsFake(authTestMiddleware)
            const usersRoute = new UserRoute()
            const users = usersRoute.usersController.userService.users

            users.findMany = jest.fn().mockReturnValue(async ():Promise<Array<User>> => [
                {
                    id: '68b4e4c6-b827-4c2b-b701-709a4286c3ee',
                    email: 'malcolm@firefly.com',
                    password: await bcrypt.hash('q1w2e3r4!', 10),
                    roles: [UserRole.NORMAL]
                },
                {
                    id: '52c055cb-9239-4bb6-b6bf-b71207af0598',
                    email: 'kaylee@firefly.com',
                    password: await bcrypt.hash('a1s2d3f4!', 10),
                    roles: [UserRole.NORMAL]
                },
                {
                    id: '7ba4b194-ecc9-4c93-a439-65861d183505',
                    email: 'river@firefly.com',
                    password: await bcrypt.hash('z1x2c3v4!', 10),
                    roles: [UserRole.NORMAL]
                },
            ])


            const app = new App([usersRoute])
            return request(app.getServer())
                .get(`${usersRoute.path}`)
                .set(authTestService.header)
                .expect(200)
        })
    })

    describe('[GET] /admin/users/:id', () => {
        it('response findOne user', async () => {
            const userId = '7fb1a983-33d9-4b24-baae-2c2482d7dae7'

            const usersRoute = new UserRoute()
            const users = usersRoute.usersController.userService.users

            users.findUnique = jest.fn().mockReturnValue(async ():Promise<User> => {
                return {
                    id: userId,
                    email: 'a@email.com',
                    password: await bcrypt.hash('q1w2e3r4!', 10),
                    roles: [UserRole.NORMAL]
                }})

            const app = new App([usersRoute])
            return request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200)
        })
    })

    describe('[POST] /users', () => {
        it('response Create user', async () => {
            const userData: UserCreateType = {
                email: 'inara@firefly.com',
                password: 'testing',
                roles: [UserRole.NORMAL],
            }

            const usersRoute = new UserRoute()
            const users = usersRoute.usersController.userService.users

            users.findUnique = jest.fn().mockReturnValue(null)
            users.create = jest.fn().mockReturnValue({
                id: 'b0ec3ad6-3e1f-4aa9-887c-839775b6ed3e',
                email: userData.email,
                password: await bcrypt.hash(userData.password, 10),
                roles: [UserRole.NORMAL],
            })

            const app = new App([usersRoute])
            return request(app.getServer())
                .post(`${ROUTER_ADMIN_PREFIX}${usersRoute.path}`)
                .send(userData)
                .expect(201)
        })
    })

    describe('[PUT] /users/:id', () => {
        it('response Update user', async () => {
            const userId = 'a'
            const userData: UserCreateType = {
                email: 'hoban@firefly.com',
                password: 'testing',
                roles: [UserRole.NORMAL],
            }

            const usersRoute = new UserRoute()
            const users = usersRoute.usersController.userService.users

            users.findUnique = jest.fn().mockReturnValue({
                id: userId,
                email: userData.email,
                password: await bcrypt.hash(userData.password, 10),
            })
            users.update = jest.fn().mockReturnValue({
                id: userId,
                email: userData.email,
                password: await bcrypt.hash(userData.password, 10),
            })

            const app = new App([usersRoute])
            return request(app.getServer()).put(`${ROUTER_ADMIN_PREFIX}${usersRoute.path}/${userId}`).send(userData).expect(200)
        })
    })

    describe('[DELETE] /users/:id', () => {
        it('response Delete user', async () => {
            const userId = 'a'
            const userData: UserCreateType = {
                email: 'test@email.com',
                password: 'q1w2e3r4',
                roles: [UserRole.NORMAL],
            }

            const usersRoute = new UserRoute()
            const users = usersRoute.usersController.userService.users

            users.findUnique = jest.fn().mockReturnValue({
                id: userId,
                email: userData.email,
                password: await bcrypt.hash(userData.password, 10),
                roles: [UserRole.NORMAL],
            })
            users.delete = jest.fn().mockReturnValue({
                id: userId,
                email: userData.email,
                password: await bcrypt.hash(userData.password, 10),
                roles: [UserRole.NORMAL],
            })

            const app = new App([usersRoute])
            return request(app.getServer()).delete(`${ROUTER_ADMIN_PREFIX}${usersRoute.path}/${userId}`).expect(200)
        })
    })
})
