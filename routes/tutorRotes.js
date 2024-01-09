// * Packages Import * //
const express = require("express");

// * Controller Import * //
const tutorLoginController = require("../controllers/tutorControllers/tutorLogin");
const tutorSignupController = require("../controllers/tutorControllers/tutorSignup");
const getAllTutors= require("../controllers/tutorControllers/getAllTutorIds")

// * Middleware Import * //
const authenticationHandler = require("../middlewares/authenticationHandler");

const route = express.Router();

route.route("/register").post(tutorSignupController);

route.route("/login").post(tutorLoginController);

route.route("/").get(authenticationHandler, getAllTutors);

module.exports = route;
