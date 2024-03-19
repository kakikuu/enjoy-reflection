const { supabaseClient } = require("../config/supabase.ts");
const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/join-members/:conference_id", async (req, res) => {
  const { conference_id } = req.params;

  try {
    const { data, error } = await supabaseClient
      .from("join_member_conference_records")
      .select("user_id")
      .eq("conference_id", conference_id);

    if (error) {
      throw error;
    }

    res.json({
      message: "User IDs retrieved successfully",
      user_ids: data.map((record) => record.user_id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve user IDs",
      error: error.message,
    });
  }
});

module.exports = router;
