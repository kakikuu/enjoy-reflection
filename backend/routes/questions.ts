const { supabaseClient } = require("../config/supabase.ts");
const express = require("express");
const router = express.Router({ mergeParams: true });

router.post("/", async (req, res) => {
  const { user_clerk_id } = req.params;
  console.log("user_id", user_clerk_id);
  const { conference_id } = req.params;
  const { question_content } = req.body;

  try {
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("user_id")
      .eq("user_clerk_id", user_clerk_id);
    console.log("userData", userData);

    if (userError) throw new Error(userError.message);
    if (!userData) throw new Error("User not found");
    const user_id = userData[0].user_id;
    const { data, error } = await supabaseClient
      .from("questions")
      .insert([
        {
          conference_record_id: conference_id,
          content: question_content,
          user_id: user_id,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json({
      message: "Question registered successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register the question",
      error: error.message,
    });
  }
});

module.exports = router;
