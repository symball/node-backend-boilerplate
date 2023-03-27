import { cleanEnv, port, str } from 'envalid'

const validateEnv = () => {
    cleanEnv(process.env, {
        DATABASE_URL: str(),
        NODE_ENV: str(),
        ORIGIN: str(),
        PORT: port(),
        AUTH_SECRET_KEY: str(),
    })
}

export default validateEnv
