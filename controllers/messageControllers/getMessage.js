const asyncHandler = require("express-async-handler");
const pool = require("../../database/db");

//@desc Get all messages for a doubt
//@route GET /api/doubts/:id/messages
//@access public
//@filters sort by: latest || oldest

const getMessagesForDoubt = asyncHandler(async (req, res) => {
  // Extract parameters from the request
  const doubtId = req?.params?.id;
  const { student_id, tutor_id, sort } = req.query;

  try {
    // Check if the doubt with the provided ID exists
    const doubtResult = await pool.query("SELECT * FROM doubts WHERE id = $1", [
      doubtId,
    ]);

    if (doubtResult.rows.length === 0) {
      res.status(404);
      throw new Error("Doubt not found");
    }

    //If user is trying to fetch other users messages
    if (
      (req?.user?.user_role === "STUDENT" && req?.user?.id !== student_id) ||
      (eq?.user?.user_role === "TUTOR" && req?.user?.id !== tutor_id)
    ) {
      res.status(401);
      throw new Error("You are not authorized to perform this task.");
    }

    // Construct the SQL query with filtering and sorting
    let sqlQuery = `
      SELECT * FROM messages
      WHERE doubt_id = $1
        ${student_id ? "AND student_id = $2" : ""}
        ${tutor_id ? "AND tutor_id = $3" : ""}
      ${
        sort === "latest"
          ? "ORDER BY created_at DESC"
          : sort === "oldest"
          ? "ORDER BY created_at ASC"
          : ""
      }
    `;

    // Execute the query
    const result = await pool.query(sqlQuery, [doubtId, student_id, tutor_id]);

    const fetchedMessages = result.rows;

    res.status(200).json({
      message: "Messages found",
      count: fetchedMessages.length,
      data: fetchedMessages,
    });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = getMessagesForDoubt;
