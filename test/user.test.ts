import express from "express";
import {buildAPTRoutes} from "../src/agir-pour-tous/routes/index.route";
import {config} from "dotenv";
import {factory, tearDownDatabase, useRefreshDatabase, useSeeding} from "typeorm-seeding";
import bodyParser from "body-parser";
import {User} from "../src/agir-pour-tous/models/user.model";
import {Post} from "../src/agir-pour-tous/models/post.model";
import supertest from "supertest-session";
import {UserController} from "../src/agir-pour-tous/controllers/user.controller";

config();
const app = express();
describe("User", () => {
    let request;
    let server;
    beforeAll(async done => {
        await useRefreshDatabase({ connection: 'memory'});
        await useSeeding();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(require('cookie-parser')());
        app.use("/", buildAPTRoutes());
        server = app.listen();
        request = supertest(app);
        done();
    });
    describe("Posts", ()=>{
        let user: User;
        let post;
        beforeAll(async () => {
            post = await factory(Post)({}).create();
            user = await factory(User)({})
                .map(async user => {
                    user.createdPosts = [post];
                    return user;
                })
                .create();
            console.log(await UserController.getInstance().getAll())
        });
        it("Should return the user",()=>{
            request.get(`/user/${user.username}`).send().then(res=>{
                expect(res.status).toEqual(200);
                expect(res.body.id).toEqual(user.id);
            });
        });
        it("Should return all the user's posts",  ()=>{
            request.get(`/user/${user.username}/posts`).send().then(res=>{
                expect(res.status).toEqual(200);
            });
       });
    });
    afterAll(async done => {
        await tearDownDatabase();
        await server.close(done);
    });
});
