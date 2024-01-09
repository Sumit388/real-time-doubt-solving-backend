// * Packages Import * //
const express = require("express");

// * Handler Import * //
const postMessage = require("../controllers/messageControllers/postMessage");
const getMessages = require("../controllers/messageControllers/getMessage");

// * Middleware Import * //
const authenticationHandler = require("../middlewares/authenticationHandler");
const authorizationHandler = require("../middlewares/authorizationHandler");

const route = express.Router();

route.use(authenticationHandler, authorizationHandler(["STUDENT", "TUTOR"]));
route.route("/").post(postMessage).get(getMessages);

module.exports = route;
