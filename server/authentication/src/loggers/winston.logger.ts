import winston from 'winston'

const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'authentication-service' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
    ],
})

export default winstonLogger
