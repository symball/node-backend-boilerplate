import request from 'supertest'
import App from '@/app'
import DefaultRoute from '@features/default/routes/default.route'

describe('Testing Index', () => {
    describe('[GET] /', () => {
        it('response statusCode 200', () => {
            const indexRoute = new DefaultRoute()
            const app = new App([indexRoute])

            return request(app.getServer()).get(`${indexRoute.path}`).expect(200)
        })
    })
})
