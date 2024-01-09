// * Packages Import * //
const asyncHandler = require("express-async-handler");

// * Utils Import * //
const pool = require("../../database/db");

//@desc Add a message to a doubt
//@route POST /api/doubts/:id/add-message
//@access public

const addMessageToDoubt = asyncHandler(async (req, res) => {
  // Extract parameters from the request
  const doubtId = req?.params?.id;
  const { body, student_id, student_name, tutor_id, tutor_name } = req.body;

  try {
    // Check if all required fields are present in the request body
    if (!body || !student_id || !student_name || !tutor_id || !tutor_name) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }

    // Check if the doubt with the provided ID exists
    const doubtResult = await pool.query("SELECT * FROM doubts WHERE id = $1", [
      doubtId,
    ]);

    if (doubtResult.rows.length === 0) {
      res.status(404);
      throw new Error("Doubt not found");
    }

    // Insert the message into the messages table with created_at timestamp
    const result = await pool.query(
      "INSERT INTO messages (doubt_id, body, sender_role, student_id, student_name, tutor_id, tutor_name, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *",
      [
        doubtId,
        body,
        req?.user?.user_role,
        student_id,
        student_name,
        tutor_id,
        tutor_name,
      ]
    );

    const addedMessage = result.rows[0];

    res.status(201).json({
      message: "Message added to doubt successfully",
      data: addedMessage,
    });
  } catch (error) {
    console.error("Error adding message to doubt:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = addMessageToDoubt;
