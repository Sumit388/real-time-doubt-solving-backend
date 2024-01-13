// * Packages Import * //
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const pool = require("../../database/db");

//@desc Tutor signup
//@route POST /api/tutors/register
//@access public
const tutorSignup = asyncHandler(async (req, res) => {
  const { name, email, password, class_grade, language, subjects } = req.body;

  // If request is invalid or incomplete
  if (!name || !email || !password || !class_grade || !language || !subjects) {
    res.statusCode(400);
    throw new Error("All fields are mandatory");
  }

  // Check if the email is already registered
  const result = await pool.query("SELECT * FROM tutors WHERE email = $1", [
    email,
  ]);
  if (result.rows.length > 0) {
    res.statusCode(400);
    throw new Error("User already exists");
  }

  // Registering the new tutor here
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO tutors (name, email, password, class_grade, language, subjects, created_at) VALUES ($1, $2, $3, $4, $5, $6,  NOW())",
    [name, email, hashedPassword, class_grade, language, subjects]
  );

  res.status(201).json({
    message: "Tutor registered successfully. Please login to continue",
  });
});

module.exports = tutorSignup;
