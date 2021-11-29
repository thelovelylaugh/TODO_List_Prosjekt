//TODO

//setup connection ---------------------
const pg = require('pg');
const dbURI = "postgres://jlpjzmkfcwxgfa:da48aedd015f3dabc38773136eb7ff0745a414d95cbf7a9c607f75a12c1a090e@ec2-52-31-219-113.eu-west-1.compute.amazonaws.com:5432/dd7qf9370fk6to";
const connstring = process.env.DATABASE_URL || dbURI;
const router = require("./modules/todolists.js")
const pool = new pg.Pool({
	connectionString: connstring,
	ssl: {rejectUnauthorized: false}
});
const users = require("./modules/users.js")

const express = require("express");
const server = express();
const PORT = process.env.PORT || 8080;
server.set("port", PORT);

// middleware ---------------------------
server.use(express.static("public"));
server.use(express.json());

server.use(router);
server.use(users);

// endpoints ----------------------------


// start server
server.listen(server.get("port"), function () {
	console.log("server running", server.get("port"));
});


