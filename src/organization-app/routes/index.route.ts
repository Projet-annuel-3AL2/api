import {config} from "dotenv";
import express, {Express} from "express";
import bodyParser from "body-parser";

config();
const app: Express = express();

app.use(bodyParser.json());

buildRoutes(app);

const port = process.env.PORT || 3000;

app.use('/');


app.listen(port, function () {
    console.log(`Listening on ${port}...`);
});
