const express = require("express");
const { supabaseClient } = require("../config/supabase.ts"); // supabaseの設定ファイルのパスを適宜調整してください
const router = express.Router({ mergeParams: true });

router.post("/", async (req, res) => {
  const { user_id } = req.params;
  const { question_id } = req.params; // URLパラメータからquestion_idを取得
  const { content } = req.body; // リクエストボディからquestion_idとcontentを取得

  try {
    // answerテーブルにデータを登録
    const { data, error } = await supabaseClient
      .from("answers")
      .insert([
        {
          user_id: user_id,
          question_id: question_id,
          content: content,
        },
      ])
      .select();

    if (error) {
      throw error; // エラーがあれば例外を投げる
    }

    // 登録成功のレスポンスを返す
    res.status(201).json({
      message: "Answer registered successfully",
      data: data,
    });
  } catch (error) {
    // エラー発生時のレスポンスを返す
    res.status(500).json({
      message: "Failed to register the answer",
      error: error.message,
    });
  }
});

module.exports = router;
