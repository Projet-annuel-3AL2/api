module.exports = {
    type: "postgres",
    logging: false,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + "/**/models/*.ts"],
    synchronize: true,
    seeds: ['src/**/*.seed.ts'],
    factories: ['src/**/*.factory.ts'],
}
