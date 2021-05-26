import {config} from "dotenv";
import bodyParser from "body-parser";
import express, {Express} from "express";
import {buildOrgAppRoutes} from "./organization-app/routes/index.route";
import {buildAPTRoutes} from "./agir-pour-tous/routes/index.route";
import {createConnection} from "typeorm";
import {AuthController} from "./agir-pour-tous/controllers/auth.controller";
import {UserType} from "./agir-pour-tous/models/user.model";

config();
createConnection().then(() => {
    const app: Express = express();
    const cors = require('cors');
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(require('cookie-parser')());
    app.use("/apt", buildAPTRoutes());
    app.use("/org-app", buildOrgAppRoutes());
    const port = process.env.PORT || 4500;
    app.listen(port, function () {
        console.log(`Listening on ${port}...`);
    });

    AuthController.getInstance().register({
        username: "admin",
        password: "admin",
        mail: "admin@admin.com",
        lastname:  "admin",
        firstname: "admin",
        userType: UserType.ADMIN
    }).then(r =>{
        console.log(r);
    });



}).catch((err) => console.log(err));
