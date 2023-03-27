import App from '@/app'
import AuthRoute from '@features/auth/routes/auth.route'
import DefaultRoute from '@features/default/routes/default.route'
import UsersRoute from '@features/users/routes/users.route'
import validateEnv from '@libs/validateEnv'
import { NODE_ENV } from '@libs/config'
import PostsRoute from '@features/posts/routes/posts.route'

if (NODE_ENV == 'production') {
    validateEnv()
} else {
    process.on('uncaughtException', (err, origin) => {
        console.log(`Caught exception: ${err}`)
        console.log(`Exception origin: ${origin}`)
    })
}

const app = new App([new DefaultRoute(), new UsersRoute(), new AuthRoute(), new PostsRoute()])

app.listen()

process.on('SIGINT', async () => await app.onShutdown())
process.on('SIGTERM', async () => await app.onShutdown())
