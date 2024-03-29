import winston from "winston";

export const logger = winston.createLogger({
    format: winston.format
        .combine(winston.format.timestamp({format: 'DD/MM/YYYY-HH:mm:ss'}),
            winston.format.printf((info) => `[${info.level.toUpperCase()}] - ${info.timestamp} - APT : ${JSON.stringify(info.message)}`)),
    transports: [
        new winston.transports.File({filename: `agir-pour-tous.log`, dirname: './logs', maxsize: 500000, maxFiles: 5}),
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(),
                winston.format.align(),
                winston.format.timestamp({format: 'DD/MM/YYYY-HH:mm:ss'}),
                winston.format.printf((info) => `[${info.level.toUpperCase()}] - ${info.timestamp} - APT : ${info.message}`))
        })
    ]
});
