const express = require("express");
const { supabaseClient } = require("../config/supabase.ts");
const router = express.Router({ mergeParams: true });

const createAuthCode = () => {
  // 認証コードの生成（例: ランダムな文字列）
  return Math.random().toString(36).substring(2, 8);
};

router.post("/", async (req, res) => {
  const { project_title } = req.body;
  const user_id = req.params.user_id;
  // projectsテーブルにプロジェクトを追加
  const projectInsertResult = await supabaseClient
    .from("projects")
    .insert([{ project_title: project_title, user_id: user_id }])
    .select();

  if (projectInsertResult.error) {
    return res.status(400).json({ error: projectInsertResult.error.message });
  }

  const project_id = projectInsertResult.data[0].project_id;
  console.log(projectInsertResult.data[0].project_id);

  // created_projectsテーブルに追加
  const createdProjectInsertResult = await supabaseClient
    .from("created_projects")
    .insert([{ project_id }])
    .select();
  // console.log("クリエイトに追加");
  // console.log(project_id);

  // 認証コードの生成
  const authCode = createAuthCode();

  // invited_projectsテーブルに追加
  const invitedProjectInsertResult = await supabaseClient
    .from("invited_projects")
    .insert([
      {
        project_id: project_id,
        invite_code: authCode,
      },
    ])
    .select();
  // console.log("インバイトに追加");
  // console.log(project_id);

  if (invitedProjectInsertResult.error) {
    return res
      .status(400)
      .json({ error: invitedProjectInsertResult.error.message });
  }

  res.status(201).json({
    project_id: project_id,
    invite_code: authCode,
  });
});

module.exports = router;
