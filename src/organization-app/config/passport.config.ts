import {getRepository} from "typeorm";
import {User} from "../models/user.model";
import {compare} from "bcrypt";
import passport from "passport";
import {Request} from "express"

const LocalStrategy = require('passport-local').Strategy;

export interface IGetUserAuthRequest extends Request {
    user: User
}

export function configure() {
    passport.use('local-org-app', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {
        getRepository(User).findOne({username: username}).then(async user => {
            if (!user || !(await compare(user.password, password))) {
                return done(null, false);
            }
            return done(null, user);
        }).catch(err => {
            return done(err);
        });
    }));

    passport.serializeUser(function (user, cb) {
        cb(null, user.id);
    });
    passport.deserializeUser(function (id, cb) {
        getRepository(User).findOne(id).then(user => {
            cb(null, user);
        }).catch(err => cb(err));
    });
}
