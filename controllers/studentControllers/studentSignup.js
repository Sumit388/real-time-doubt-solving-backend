// * Packages Import * //
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const pool = require("../../database/db");

//@desc User signup
//@route POST /api/users/register
//@access public
const studentSignup = asyncHandler(async (req, res) => {
  const { name, email, password, class_grade, language } = req.body;

  // If request is invalid or incomplete
  if (!name || !email || !password || !class_grade || !language) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  // Check if the email is already registered
  const result = await pool.query("SELECT * FROM students WHERE email = $1", [
    email,
  ]);
  if (result.rows.length > 0) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Registering the new user here
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO students (name, email, password, class_grade, language, created_at) VALUES ($1, $2, $3, $4, $5,  NOW())",
    [name, email, hashedPassword, class_grade, language]
  );

  res.status(201).json({
    message: "User registered successfully. Please login to continue",
  });
});

module.exports = studentSignup;
