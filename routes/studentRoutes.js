// * Packages Import * //
const express = require("express");

// * Controller Import * //
const studendLoginController = require("../controllers/studentControllers/studentLogIn");
const studendSignupController = require("../controllers/studentControllers/studentSignup");
const getAllstudents = require("../controllers/studentControllers/getAllStudentIds");

// * Middleware Import * //
const authenticationHandler = require("../middlewares/authenticationHandler");

const route = express.Router();

route.route("/register").post(studendSignupController);

route.route("/login").post(studendLoginController);

route.route("/").get(authenticationHandler, getAllstudents);

module.exports = route;
