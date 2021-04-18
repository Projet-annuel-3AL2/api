import {createConnection} from "typeorm";
import {config} from "dotenv";
import bodyParser from "body-parser";
import express, {Express} from "express";
import {buildOrgAppRoutes} from "./organization-app/routes/index.route";
import {buildAPTRoutes} from "./agir-pour-tous/routes/index.route";

config();
createConnection({
    type: "postgres",
    logging: true,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + "/**/models/*.ts"],
    synchronize: true
}).then(() => {
    const app: Express = express();
    app.use(bodyParser.json());
    app.use("/apt", buildAPTRoutes());
    app.use("/org-app", buildOrgAppRoutes());
    const port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log(`Listening on ${port}...`);
    });
});


