// * Packages Import * //
const asyncHandler = require("express-async-handler");

// * Utils Import * //
const pool = require("../../database/db");

//@desc Get all Doubts by student_id
//@route GET /api/doubts/students/id
//@access public
//@filters search by: tutor || subject || grade || language ,
//          sort by: latest || oldest

const getAllBlogs = asyncHandler(async (req, res) => {
  // Extract query parameters from the request
  const studentId = req?.params?.id;
  const { subject, language, sort, status } = req.query;

  try {
    // Construct the SQL query with filtering, sorting, and status
    let sqlQuery = `
      SELECT *,
        CASE
          WHEN tutor_id IS NULL THEN 'pending'
          ELSE 'active'
        END AS status
      FROM doubts
      WHERE student_id = $1
        ${subject ? "AND subject = $2" : ""}
        ${language ? "AND language = $3" : ""}
        ${
          status === "pending"
            ? "AND tutor_id IS NULL"
            : status === "active"
            ? "AND tutor_id IS NOT NULL"
            : ""
        }
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
      studentId,
      subject,
      language,
    ]);

    const fetchedDoubts = result.rows;

    res.status(200).json({
      message: "Doubts found",
      count: fetchedDoubts.length,
      data: fetchedDoubts,
    });
  } catch (error) {
    console.error("Error retrieving doubts:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = getAllBlogs;
