// * Packages Import * //
const asyncHandler = require("express-async-handler");

// * Utils Import * //
const pool = require("../../database/db");

//@desc Upload a doubt
//@route POST /api/blogs
//@access ADMIN & EDITOR
const addDoubt = asyncHandler(async (req, res) => {
  const { student_id, student_name, subject, class_grade, language, body, title } =
    req.body;

  if (
    !student_id ||
    !subject ||
    !class_grade ||
    !language ||
    !body ||
    !student_name||
    !title
  ) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  try {
    // Check if the student with the provided ID exists
    const studentResult = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [student_id]
    );

    if (studentResult.rows.length === 0) {
      res.status(400);
      throw new Error("Student not found");
    }

    // Insert doubt into the doubts table with TutorID set to NULL and created_at timestamp
    await pool.query(
      `INSERT INTO doubts (student_id, tutor_id, 
        subject, class_grade, language, body, created_at, 
        student_name, tutor_name, title) 
        VALUES ($1, NULL, $2, $3, $4, $5, NOW(), $6, NULL, $7)`,
      [student_id, subject, class_grade, language, body, student_name, title]
    );

    res.status(201).json({
      message: "Added new doubt",
    });
  } catch (error) {
    console.error("Error adding doubt:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = addDoubt;
