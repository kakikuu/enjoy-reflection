const { supabaseClient } = require("../config/supabase.ts");
const express = require("express");
const router = express.Router({ mergeParams: true });

const createAuthCode = () => {
  // 認証コードの生成（例: ランダムな文字列）
  return Math.random().toString(36).substring(2, 8);
};

router.get("/", async function (req, res, next) {
  // URLパラメータからユーザーIDを取得
  const user_clerk_id = req.params.user_clerk_id;
  console.log(user_clerk_id);

  try {
    // ユーザー情報の取得
    const { data: userInfoData, error: userInfoError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("user_clerk_id", user_clerk_id)
      .single(); // 単一のレコードを取得

    if (userInfoError) throw userInfoError;
    if (!userInfoData)
      return res.status(404).json({ message: "User not found" });

    // userInfoDataからuser_idを取得
    const user_id = userInfoData.user_id;

    // user_idを使用してプロジェクト情報を取得
    const { data: projectsData, error: projectsError } = await supabaseClient
      .from("projects")
      .select("*")
      .eq("user_id", user_id);

    if (projectsError) throw projectsError;

    // プロジェクトのデータをレスポンスとして返す
    res.json(projectsData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch data", error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { project_title } = req.body;
  const user_ckerk_id = req.params.user_clerk_id;
  const user_id = supabaseClient
    .from("users")
    .select("user_id")
    .eq("user_ckerk_id", user_ckerk_id);
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

  const createdProjectInsertResult = await supabaseClient
    .from("created_projects")
    .insert([{ project_id }])
    .select();
  // console.log("クリエイトに追加");
  // console.log(project_id);

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
