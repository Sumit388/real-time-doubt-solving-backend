// * Packages Import * //
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// * Utils Import * //
const pool = require("../../database/db");

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

  try {
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
          id: tutor.id,
          email: tutor.email,
          user_role: "TUTOR",
        },
      },
      process.env.SECRET_KEY,
      { expiresIn: "60m" }
    );

    res
      .status(200)
      .cookie("auth_token", token)
      .cookie("user_role", "TUTOR")
      .cookie("class_grade", tutor.class_grade)
      .cookie("language", tutor.language)
      .json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = tutorLogin;
