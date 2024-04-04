const { supabaseClient } = require("../config/supabase.ts");
const express = require("express");
const router = express.Router({ mergeParams: true });

router.post("/", async (req, res) => {
  const { user_clerk_id } = req.params;
  console.log("user_id", user_clerk_id);
  const { conference_id } = req.params;
  const { question_content } = req.body;

  try {
    const { data, error } = await supabaseClient
      .from("questions")
      .insert([
        {
          conference_record_id: conference_id,
          content: question_content,
          user_id: user_clerk_id,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    const question_id = data[0].question_id; // 登録された質問のIDを取得

    res.status(201).json({
      message: "Question registered successfully",
      question_id: question_id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register the question",
      error: error.message,
    });
  }
});

module.exports = router;
