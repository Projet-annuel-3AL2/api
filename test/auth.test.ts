import express from "express";
import {buildAPTRoutes} from "../src/agir-pour-tous/routes/index.route";
import {createConnection} from "typeorm";
import {config} from "dotenv";
import {factory, tearDownDatabase, useRefreshDatabase, useSeeding} from "typeorm-seeding";
import {User} from "../src/agir-pour-tous/models/user.model";
import bodyParser from "body-parser";
import session from "supertest-session";
import * as faker from 'faker';

config();
const app = express();
describe("Auth", () => {
    beforeAll(async done => {
        await createConnection();
        await useSeeding()
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(require('cookie-parser')());
        app.use("/", buildAPTRoutes());
        await useRefreshDatabase()
        done();
    });
    describe("Login", () => {
        let testSession;
        let user: User;
        beforeAll(async done => {
            user = await factory(User)({"username": "admin", "password": "admin"}).create();
            testSession = session(app);
            done();
        });
        it("Should login if the user isn't logged on this session", async () => {
            const {body, status} = await testSession
                .post("/auth/login")
                .send({username: "admin", password: "admin"});
            expect(status).toEqual(200);
            expect(body.username).toEqual(user.username);
        });
        it("Should refuse to login the user if he's already logged on this session", async () => {
            const {body, status} = await testSession
                .post("/auth/login")
                .send({username: "admin", password: "admin"});
            expect(status).toEqual(401);
            expect(body).toEqual({});
        });
    });
    describe("Logout", () => {
        let testSession;
        testSession = session(app);
        beforeAll(async done => {
            await testSession.post("/auth/login")
                .send({username: "admin", password: "admin"});
            done();
        });
        it("Should disconnect the user if he is logged on the session", async () => {
            const {status} = await testSession.delete("/auth/logout");
            expect(status).toEqual(204);
        });
        it("Should refuse the user to log out if he is not logged on the session", async () => {
            const {status} = await testSession.delete("/auth/logout");
            expect(status).toEqual(401);
        });
    });
    describe("Register", () => {
        let testSession;
        let user;
        beforeAll(async done => {
            user = {
                username: faker.random.alphaNumeric(20),
                mail: faker.internet.email(),
                password: faker.random.alphaNumeric(30)
            }
            testSession = session(app);
            done();
        });
        it("Should register the new user", async () => {
            const {body, status} = await testSession
                .post("/auth/register")
                .send(user);
            expect(status).toEqual(200);
            expect(body.username).toEqual(user.username);
            expect(body.mail).toEqual(user.mail);
        });
        it("Should refuse to register if the mail is already taken", async () => {
            const newUser = {
                username: faker.random.alphaNumeric(20),
                mail: user.mail,
                password: faker.random.alphaNumeric(30)
            }
            const {status} = await testSession
                .post("/auth/register")
                .send(newUser);
            expect(status).toEqual(400);
        });
        it("Should refuse to register if the username is already taken", async () => {
            const newUser = {
                username: user.username,
                mail: faker.internet.email(),
                password: faker.random.alphaNumeric(30)
            }
            const {status} = await testSession
                .post("/auth/register")
                .send(newUser);
            expect(status).toEqual(400);
        });
        it("Should refuse to register if the username is empty", async () => {
            const newUser = {
                username: "",
                mail: faker.internet.email(),
                password: faker.random.alphaNumeric(30)
            }
            const {body, status} = await testSession
                .post("/auth/register")
                .send(newUser);
            expect(status).toEqual(400);
            expect(body[0].property).toEqual("username");
        });
        it("Should refuse to register if the email is empty", async () => {
            const newUser = {
                username: faker.random.alphaNumeric(20),
                mail: faker.random.alphaNumeric(20),
                password: faker.random.alphaNumeric(30)
            }
            const {body, status} = await testSession
                .post("/auth/register")
                .send(newUser);
            expect(status).toEqual(400);
            expect(body[0].property).toEqual("mail");
        });
    });
    afterAll(async done => {
        await tearDownDatabase();
        done();
    });
});
