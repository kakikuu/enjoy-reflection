const { supabaseClient } = require("../config/supabase.ts");
const express = require("express");
const router = express.Router({ mergeParams: true });

// ID生成のための仮の関数
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

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

router.post("/", async (req, res) => {
  const { conference_id } = req.params;
  const invite_id = generateUniqueId(); // invite_id の生成

  try {
    // began_conference_records テーブルにデータを挿入
    const { data, error } = await supabaseClient
      .from("began_conference_records")
      .insert([
        {
          invite_code: invite_id,
          conference_record_id: conference_id,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    // 成功レスポンス
    res.status(201).json({
      message: "Conference created successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create the conference",
      error: error.message,
    });
  }
});

router.post("/join", async (req, res) => {
  const { user_id } = req.params;
  const { invite_id } = req.body;

  try {
    // began_conferenceテーブルからinvite_idと一致するレコードを検索
    const { data: beganConferenceData, error: beganConferenceError } =
      await supabaseClient
        .from("began_conference")
        .select("conference_record_id")
        .eq("invite_id", invite_id)
        .select();

    if (beganConferenceError) throw beganConferenceError;
    if (!beganConferenceData)
      return res.status(404).json({ message: "Invite ID not found" });

    // join_member_conferenceテーブルにuser_idとconference_records_idを追加
    const { error: joinMemberError } = await supabaseClient
      .from("join_member_conference")
      .insert([
        {
          user_id: user_id,
          conference_records_id: beganConferenceData.conference_records_id,
        },
      ])
      .select();

    if (joinMemberError) throw joinMemberError;

    // 成功レスポンス
    res.status(201).json({
      message: "Successfully joined the conference",
      conference_records_id: beganConferenceData.conference_records_id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to join the conference",
      error: error.message,
    });
  }
});

module.exports = router;
