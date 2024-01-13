// * Packages Import * //
const express = require("express");

// * Handler Import * //
const addDoubt = require("../controllers/doubtsControllers/postDoubt");
const getTutorDoubts = require("../controllers/doubtsControllers/getTutorsDoubts");
const getStudentDoubts = require("../controllers/doubtsControllers/getStudentDoubts");
const addDoubtTutor = require("../controllers/doubtsControllers/addDoubtTutor");
const getAllPendingDoubts = require("../controllers/doubtsControllers/getAllPendingDoubts");

// * Middleware Import * //
const authenticationHandler = require("../middlewares/authenticationHandler");
const authorizationHandler = require("../middlewares/authorizationHandler");

const route = express.Router();

route
  .route("/")
  .post(authenticationHandler, authorizationHandler(["STUDENT"]), addDoubt);

route
  .route("/students/:id")
  .get(
    authenticationHandler,
    authorizationHandler(["STUDENT"]),
    getStudentDoubts
  );

  route
  .route("/pending")
  .get(
    authenticationHandler,
    getAllPendingDoubts
  );

route
  .route("/tutors/:id")
  .get(authenticationHandler, authorizationHandler(["TUTOR"]), getTutorDoubts);

route
  .route("/:id/add-tutor")
  .patch(authenticationHandler, authorizationHandler(["TUTOR"]), addDoubtTutor);

module.exports = route;
