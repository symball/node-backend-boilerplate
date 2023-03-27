import request from 'supertest'
import App from '@/app'
import AuthRoute from '@features/auth/routes/auth.route'
import { UserSecurityType } from '@features/auth/dtos/auth.dto'
import { createSandbox } from 'sinon'
import { AuthTestingService, authTestMiddleware } from '@features/auth/services/auth.testing.service'
import { AUTH_PARAMETER_KEY } from '@libs/config'
import * as auth from '@features/auth/middlewares/auth.middleware'

let authTestService:AuthTestingService
const sandbox = createSandbox()
beforeAll(async() => {
    authTestService = await AuthTestingService.Create()
})
afterAll(sandbox.restore)

describe('Integration Tests: Auth', () => {
    describe('[POST] /signup', () => {
        it('respond (201) && include user data', async () => {
            const regData: UserSecurityType = {
                email: authTestService.user.email,
                password: authTestService.user.password,
            }

            const authRoute = new AuthRoute()
            const users = authRoute.authController.authService.users
            users.findUnique = jest.fn().mockReturnValue(null)
            users.create = jest.fn().mockReturnValue(authTestService.user)

            const app = new App([authRoute])
            request(app.getServer())
                .post(`${authRoute.path}signup`)
                .send(regData)
                .expect(201)
        })
    })

    describe('[POST] /login', () => {
        it('respond (200) && include user data && Set Cookie', async () => {
            const loginData: UserSecurityType = {
                email: authTestService.user.email,
                password: authTestService.password,
            }

            const authRoute = new AuthRoute()
            const users = authRoute.authController.authService.users

            users.findUnique = jest.fn().mockReturnValue(authTestService.user)

            const app = new App([authRoute])
            return request(app.getServer())
                .post(`${authRoute.path}login`)
                .send(loginData)
                .expect('Set-Cookie', new RegExp(`${AUTH_PARAMETER_KEY}*`))
                .expect(200)
        })
        it('respond (401) && include message', async () => {
            let loginData: UserSecurityType = {
                email: authTestService.user.email,
                password: 'wrong-password',
            }

            const authRoute = new AuthRoute()
            const users = authRoute.authController.authService.users

            users.findUnique = jest.fn().mockReturnValue(authTestService.user)

            const app = new App([authRoute])
            return request(app.getServer())
                .post(`${authRoute.path}login`)
                .send(loginData)
                .expect(401, {
                    message: 'Wrong Username / Password',
                })

            loginData = {
                email: 'not@applicable.com',
                password: authTestService.user.password,
            }

            return request(app.getServer())
                .post(`${authRoute.path}login`)
                .send(loginData)
                .expect(401, {
                    message: 'Wrong Username / Password',
                })
        })
    })

    describe('[GET] /logout', () => {
        it('respond (200) && include message && Set Cookie', async () => {
            sandbox.stub(auth, 'authMiddleware').callsFake(authTestMiddleware)
            const authRoute = new AuthRoute()
            const users = authRoute.authController.authService.users

            users.findUnique = jest.fn().mockReturnValue(authTestService.user)

            const app = new App([authRoute])
            return request(app.getServer())
                .get(`${authRoute.path}logout`)
                .set(authTestService.header)

            // .expect('Set-Cookie', new RegExp(`${AUTH_PARAMETER_KEY}*`))
                .expect(200, {
                    message: 'logout',
                })

        })
    })
})
