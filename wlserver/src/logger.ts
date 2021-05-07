import winston from 'winston';
import * as Transport from 'winston-transport';
import expressWinston from 'express-winston';

const transports: Transport[] = [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
]

if (process.env.NODE_ENV !== 'production') {
    transports.push(new winston.transports.Console({ format: winston.format.simple() }));
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports
});

export const expressLogger = expressWinston.logger({
    transports,
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true,
    expressFormat: true,
})


export default logger;
