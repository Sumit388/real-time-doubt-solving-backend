// * Packages Import * //
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// * Utils Import * //
const pool = require("../../database/db");

//@desc User login
//@route POST /api/students/login
//@access public
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // If any of the fields are empty
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory.");
  }

  // Fetch user from PostgreSQL
  const result = await pool.query("SELECT * FROM students WHERE email = $1", [
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
  const user = result.rows[0];
  const token = jwt.sign(
    {
      user: {
        name: user.name,
        id: user.id,
        email: user.email,
        user_role: "STUDENT",
      },
    },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );

  res.status(200).json({
    message: "Login successful",
    user: {
      auth_token: token,
      user_role: "STUDENT",
      class_grade: user.class_grade,
      language: user.language,
      user_id: user.id,
      user_name: user.name,
      email: user.email,
    },
  });
});

module.exports = userLogin;
