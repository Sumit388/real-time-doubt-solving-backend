// * Packages Import * //
const express = require("express");
const dotenv = require("dotenv").config();
const cors=require("cors")


// * Routes Import * //
const studentRoutes = require("./routes/studentRoutes");
const tutorRoutes = require("./routes/tutorRotes");
const doubtRoutes = require("./routes/doubtRoutes");
const messageRoutes = require("./routes/messageRoutes");

// * Middleware Import * //
const errorHandler = require("./middlewares/errorHandler");

// * Utils Import * //

const app = express();
const port = process.env.PORT;

const corsOptions = {
  origin: '*',
  methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(express.json());
app.use(cors(corsOptions));
app.use("/api/students", studentRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/doubts/:id/message", messageRoutes);
app.use(errorHandler);

try {
  app.listen(port, () => console.log(`Server has started on ${port}`));
} catch (err) {
  console.log(err);
}
