import {createConnections} from "typeorm";

export const connection = createConnections([{
    name: "organization-app",
    type: "postgres",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    schema:"organization-app"
}, {
    name: "agir-pour-tous",
    type: "postgres",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    schema:"agir-pour-tous"
}]);

connection.then(value => value[0].)
