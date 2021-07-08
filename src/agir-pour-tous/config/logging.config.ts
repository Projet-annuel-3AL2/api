import winston from "winston";

const appSettings = {
    level: 'all',
    LogConfig: {
        format: winston.format
            .combine(winston.format.timestamp({ format: 'DD/MM/YYYY-HH:mm:ss' }),
                winston.format
                    .printf((info) => `[${info.level.toUpperCase()}] - ${info.timestamp} - APT : ${info.message}`)),
        transports: [
            new winston.transports.File({filename: `./logs/application_api_logfile.log`}),
            new winston.transports.Console({
                format: winston.format
                    .combine(winston.format.colorize(),
                    winston.format.align(),
                    winston.format.timestamp({ format: 'DD/MM/YYYY-HH:mm:ss' }),
                    winston.format
                        .printf((info) => `[${info.level.toUpperCase()}] - ${info.timestamp} - APT : ${info.message}`))
            })
        ]
    }
};

export const logger = winston.createLogger(appSettings.LogConfig);
