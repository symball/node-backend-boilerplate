import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'
import { LOG_DIR, LOG_LEVEL, LOG_TO_FILE } from './/config'

// logs dir
const logDir: string = join(__dirname, LOG_DIR)
if (!existsSync(logDir)) {
    mkdirSync(logDir)
}

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
        }),
    ],
})

if (LOG_TO_FILE) {
    logger.debug(`Logging to files at path: ${logDir}`)
    logger.add(
        new winstonDaily({
            level: 'debug',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/debug', // log file /logs/debug/*.log in save
            filename: '%DATE%.log',
            maxFiles: 30, // 30 Days saved
            json: false,
            zippedArchive: true,
        }),
    )
    logger.add(
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error', // log file /logs/error/*.log in save
            filename: '%DATE%.log',
            maxFiles: 30, // 30 Days saved
            handleExceptions: true,
            json: false,
            zippedArchive: true,
        }),
    )
}

const stream = {
    write: (message: string) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')))
    },
}

export { logger, stream }
