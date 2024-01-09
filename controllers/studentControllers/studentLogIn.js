// * Packages Import * //
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// * Utils Import * //
const pool = require("../../database/db");

//@desc User login
//@route POST /api/users/login
//@access public
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // If any of the fields are empty
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory.");
  }

  try {
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
    
    console.log('Secret Key:', process.env.SECRET_KEY);

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
      { expiresIn: "60m" }
    );

    res
      .status(200)
      .cookie("auth_token", token)
      .cookie("user_role", "STUDENT")
      .cookie("class_grade", user.class_grade)
      .cookie("language", user.language)
      .json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = userLogin;
