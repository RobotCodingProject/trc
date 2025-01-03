"use strict";

// modules
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const errorhandler = require("./src/public/js/contacts/errorhandler");
const methodOverride = require("method-override");

const app = express();

// routing
const home = require("./src/routes/home");
const contacts = require("./src/routes/contacts/contacts");

// app setting
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(errorhandler);
app.use(methodOverride("_method"));

app.use("/", home);
app.use("/contacts", contacts);

module.exports = app;
