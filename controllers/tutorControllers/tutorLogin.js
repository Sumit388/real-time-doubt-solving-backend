// * Packages Import * //
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// * Utils Import * //
const pool = require("../../database/db");
const { user } = require("pg/lib/defaults");

//@desc Tutor login
//@route POST /api/tutors/login
//@access public
const tutorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // If any of the fields are empty
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory.");
  }

  // Fetch tutor from PostgreSQL
  const result = await pool.query("SELECT * FROM tutors WHERE email = $1", [
    email,
  ]);

  // If the email or the password is invalid
  if (
    result.rows.length === 0 ||
    !(await bcrypt.compare(password, result.rows[0].password))
  ) {
    res.status(400);
    throw new Error("Email or password invalid.");
  }

  // If everything is valid
  const tutor = result.rows[0];
  const token = jwt.sign(
    {
      user: {
        name: tutor.name,
        id: tutor.tutor_id,
        email: tutor.email,
        user_role: "TUTOR",
      },
    },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );

  res
    .status(200)
    .json({
      message: "Login successful",
      user: {
        auth_token: token,
        user_role: "TUTOR",
        class_grade: tutor.class_grade,
        language: tutor.language,
        user_id: tutor.tutor_id,
        user_name: tutor.name,
        email: tutor.email,
        subjects: tutor.subjects,
      },
    });
});

module.exports = tutorLogin;
