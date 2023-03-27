import { config } from 'dotenv'

const parseEnvBool = (value: string | undefined, fallback: boolean) => {
    if (typeof value == 'undefined' || value.length == 0) {
        return fallback
    }
    if (['true', '1', 'yes'].includes(value)) {
        return true
    }
    return false
}

const parseEnvInt = (value: string | undefined, fallback: number): number => {
    if (typeof value == 'undefined' || value.length == 0) {
        return fallback
    }
    const parsed = parseInt(value)
    if (isNaN(parsed)) {
        return fallback
    }
    return parsed
}

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` })

export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://development:development@localhost:5432/development'

export const CREDENTIALS: boolean = parseEnvBool(process.env.CREDENTIALS, true)
export const ORIGIN: string = process.env.ORIGIN || '*'

export const NODE_ENV: string = process.env.NODE_ENV || 'development'
export const PORT: number = parseEnvInt(process.env.PORT, 3000)

export const AUTH_SECRET_KEY: string = process.env.SECRET_KEY || 'development'
export const AUTH_SALT_ROUNDS: number = parseEnvInt(process.env.AUTH_SALT_ROUNDS, 10)
export const AUTH_PARAMETER_KEY: string = process.env.AUTH_PARAMETER_KEY || 'Authorization'
export const AUTH_PARAMETER_PREFIX: string = process.env.AUTH_PARAMETER_PREFIX || 'Bearer'
export const AUTH_TOKEN_LIFETIME_MINUTES: number = parseEnvInt(process.env.AUTH_TOKEN_LIFETIME_MINUTES, 300)

export const LOG_TO_FILE: boolean = parseEnvBool(process.env.LOG_TO_FILE, true)
export const LOG_FORMAT: string = process.env.LOG_FORMAT || 'combined'
export const LOG_LEVEL: string = process.env.LOG_LEVEL || 'info'
export const LOG_DIR: string = process.env.LOG_DIR || '../../logs'

export const POSTS_PER_PAGE: number = parseEnvInt(process.env.POSTS_PER_PAGE, 10)

export const ROUTER_ADMIN_PREFIX: string = process.env.ROUTER_ADMIN_PREFIX || '/admin'
export const ROUTER_SWAGGER_ENABLE: boolean = parseEnvBool(process.env.ROUTER_SWAGGER_ENABLE, false)
