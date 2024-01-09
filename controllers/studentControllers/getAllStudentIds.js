// * Packages Import * //
const asyncHandler = require("express-async-handler");

// * Utils Import * //
const pool = require("../../database/db");

//@desc Get all students with their names and IDs
//@route GET /api/students/all
//@access public

const getAllStudents = asyncHandler(async (req, res) => {
  try {
    // Retrieve all students with their names and IDs
    const result = await pool.query('SELECT id, name FROM students');

    const students = result.rows;

    res.status(200).json({
      message: "Students found",
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Error retrieving students:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = getAllStudents;
