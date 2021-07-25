import {getRepository} from "typeorm";
import {User} from "../models/user.model";
import {compare} from "bcrypt";
import passport from "passport";

const LocalStrategy = require('passport-local').Strategy;


export function configure() {
    passport.use('local-agir-pour-tous', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {
        getRepository(User).findOne({username: username}, {select: ["id", "username", "password", "userType"]}).then(async user => {
            if (user === undefined) {
                return done(null, false);
            }
            if (!(await compare(password, user.password))) {
                return done(null, false);
            }
            return done(null, user);
        }).catch(err => {
            return done(err);
        });
    }));

    passport.serializeUser(function (user: User, cb) {
        cb(null, user.id);
    });

    passport.deserializeUser(function (req,id, cb) {
        getRepository(User).findOneOrFail(id).then(user => {
            cb(null, user);
        }).catch(() => {
            req.session.destroy(err=>cb(err, false));
        });
    });
}
