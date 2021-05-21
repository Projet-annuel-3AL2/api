import {config} from "dotenv";
import bodyParser from "body-parser";
import express, {Express} from "express";
import {buildOrgAppRoutes} from "./organization-app/routes/index.route";
import {buildAPTRoutes} from "./agir-pour-tous/routes/index.route";
import {createConnection} from "typeorm";

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
    //AuthController.getInstance().then(c=>c.register({username:"admin", password:"admin", mail:"admin@admin.com",isAdmin:true,lastname:"admin",firstname:"admin"}))
    const app: Express = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(require('cookie-parser')());
    app.use("/apt", buildAPTRoutes());
    app.use("/org-app", buildOrgAppRoutes());
    const port = process.env.PORT || 4500;
    app.listen(port, function () {
        console.log(`Listening on ${port}...`);
    });
}).catch((err) => console.log(err));
