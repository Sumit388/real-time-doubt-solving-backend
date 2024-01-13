// * Packages Import * //
const asyncHandler = require("express-async-handler");

// * Utils Import * //
const pool = require("../../database/db");

//@desc Get all pending doubts
//@route GET /api/doubts/pending
//@access public
//@filters search by: tutor || subject || grade || language ,
//          sort by: latest || oldest

const getAllPendingDoubts = asyncHandler(async (req, res) => {
  // Extract query parameters from the request
  const { subject, language, class_grade, sort } = req.query;

  try {
    // Construct the SQL query with filtering, sorting, and status
    let sqlQuery = `
      SELECT *,
        'pending' AS status
      FROM doubts
      WHERE tutor_id IS NULL
        ${subject ? "AND subject = $1" : ""}
        ${language ? "AND language = $2" : ""}
        ${class_grade ? "AND class_grade = $3" : ""}
      ${
        sort === "latest"
          ? "ORDER BY created_at DESC"
          : sort === "oldest"
          ? "ORDER BY created_at ASC"
          : ""
      }
    `;

    // Execute the query
    const result = await pool.query(sqlQuery, [
      subject,
      language,
      class_grade
    ]);

    const fetchedDoubts = result.rows;

    res.status(200).json({
      message: "Pending doubts found",
      count: fetchedDoubts.length,
      data: fetchedDoubts,
    });
  } catch (error) {
    console.error("Error retrieving pending doubts:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = getAllPendingDoubts;
