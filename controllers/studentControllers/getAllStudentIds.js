// * Packages Import * //
const asyncHandler = require("express-async-handler");

// * Utils Import * //
const pool = require("../../database/db");

//@desc Get all students with their names and IDs
//@route GET /api/students/all
//@access public

const getAllStudents = asyncHandler(async (req, res) => {
  // Retrieve all students with their names and IDs
  const result = await pool.query("SELECT id, name FROM students");

  const students = result.rows;

  res.status(200).json({
    message: "Students found",
    count: students.length,
    data: students,
  });
});

module.exports = getAllStudents;
