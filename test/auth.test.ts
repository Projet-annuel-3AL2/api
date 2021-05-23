import express from "express";
import {buildAPTRoutes} from "../src/agir-pour-tous/routes/index.route";
import {createConnection} from "typeorm";
import {config} from "dotenv";
import {factory, tearDownDatabase, useSeeding} from "typeorm-seeding";
import {User} from "../src/agir-pour-tous/models/user.model";
import bodyParser from "body-parser";
import session from "supertest-session";

config();
const app = express();
let testSession;
describe("Auth", () => {
    beforeAll(async done=>{
        await createConnection();
        await useSeeding()
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(require('cookie-parser')());
        app.use("/", buildAPTRoutes());
        done();
    });
    describe("Login", ()=>{
        beforeAll(async done=>{
            await factory(User)({"username":"admin", "password":"admin"}).create();
            testSession = session(app);
            done();
        });
        it("Should login if the user isn't logged on this session", async () => {
            const { body, status } = await testSession
                .post("/auth/login")
                .send({username:"admin", password:"admin"});
            expect(status).toEqual(200);
            expect(body.username).toEqual("admin");
        });
        it("Should refuse to login the user if he's already logged on this session", async ()=> {
            const { body, status } = await testSession
                .post("/auth/login")
                .send({username:"admin", password:"admin"});
            expect(status).toEqual(401);
            expect(body).toEqual({});
        });
    });
    afterAll(async done => {
        await tearDownDatabase();
        done();
    });
});
