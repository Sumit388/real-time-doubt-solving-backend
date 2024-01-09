// * Packages Import * //
const asyncHandler = require("express-async-handler");

// * Utils Import * //
const pool = require("../../database/db");

//@desc Add tutor to a doubt
//@route PATCH /api/doubts/:id/add-tutor
//@access public

const addTutorToDoubt = asyncHandler(async (req, res) => {
  // Extract parameters from the request
  const doubtId = req?.params?.id;
  const { tutorId, tutorName } = req.body;

  try {
    // Check if the doubt with the provided ID exists
    const doubtResult = await pool.query('SELECT * FROM doubts WHERE id = $1', [doubtId]);

    if (doubtResult.rows.length === 0) {
      res.status(404);
      throw new Error("Doubt not found");
    }

    // Update the doubt with the provided tutorId and tutorName
    await pool.query(
        'UPDATE doubts SET tutor_id = $1, tutor_name = $2 WHERE id = $3',
        [tutorId, tutorName, doubtId]
      );

    res.status(200).json({
      message: "Tutor added to doubt successfully",
    });
  } catch (error) {
    console.error("Error adding tutor to doubt:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = addTutorToDoubt;
