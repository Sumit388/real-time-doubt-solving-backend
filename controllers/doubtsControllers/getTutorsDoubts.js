// * Packages Import * //
const asyncHandler = require("express-async-handler");

// * Utils Import * //
const pool = require("../../database/db");

//@desc Get all Doubts by tutor_id
//@route GET /api/doubts/tutors/id
//@access public
//@filters search by: student || subject || grade || language ,
//          sort by: latest || oldest

const getAllDoubtsByTutor = asyncHandler(async (req, res) => {
  // Extract query parameters from the request
  const tutorId = req?.params?.id;
  const { sort } = req.query;

  try {
    // Construct the SQL query with filtering and sorting
    let sqlQuery = `
      SELECT * FROM doubts
      WHERE tutor_id = $1
      ${sort === 'latest' ? 'ORDER BY created_at DESC' : sort === 'oldest' ? 'ORDER BY created_at ASC' : ''}
    `;

    // Execute the query
    const result = await pool.query(sqlQuery, [tutorId]);

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

module.exports = getAllDoubtsByTutor;
