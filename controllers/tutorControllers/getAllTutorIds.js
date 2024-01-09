// * Packages Import * //
const asyncHandler = require("express-async-handler");

// * Utils Import * //
const pool = require("../../database/db");

//@desc Get all tutors with their names and IDs
//@route GET /api/tutors/all
//@access public

const getAllTutors = asyncHandler(async (req, res) => {
  try {
    // Retrieve all tutors with their names and IDs
    const result = await pool.query('SELECT id, name FROM tutors');

    const tutors = result.rows;

    res.status(200).json({
      message: "Tutors found",
      count: tutors.length,
      data: tutors,
    });
  } catch (error) {
    console.error("Error retrieving tutors:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = getAllTutors;
