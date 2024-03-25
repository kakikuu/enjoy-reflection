const { supabaseClient } = require("../config/supabase.ts");
const express = require("express");
const router = express.Router({ mergeParams: true });

const createAuthCode = () => {
  // 認証コードの生成（例: ランダムな文字列）
  return Math.random().toString(36).substring(2, 8);
};

router.post("/", async (req, res) => {
  const { project_title } = req.body;
  const { user_clerk_id } = req.params;

  try {
    // usersテーブルからuser_idを取得
    console.log("user_clerk_id", user_clerk_id);
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("user_id")
      .eq("user_clerk_id", user_clerk_id);
    console.log("userData", userData);

    if (userError) throw new Error(userError.message);
    if (!userData) throw new Error("User not found");
    const user_id = userData[0].user_id;

    console.log("user_id", user_id);
    const { data: projectData, error: projectError } = await supabaseClient
      .from("projects")
      .insert([
        { project_title: project_title, user_id: user_id }, // オブジェクトの形式に注意
      ])
      .select();
    console.log("projectData", projectData);

    if (projectError) throw new Error(projectError.message);
    if (!projectData) throw new Error("Project creation failed");

    const project_id = projectData[0].project_id; // 追加されたプロジェクトのIDを取得

    // 認証コードの生成
    const authCode = createAuthCode();

    // invited_projectsテーブルに追加
    const { data: invitedProjectData, error: invitedProjectError } =
      await supabaseClient.from("invited_projects").insert([
        {
          project_id: project_id,
          invite_code: authCode,
        },
      ]);

    if (invitedProjectError) throw new Error(invitedProjectError.message);

    // 正常に処理された場合、プロジェクトIDと認証コードをレスポンスとして返す
    res.status(201).json({
      project_id: project_id,
      invite_code: authCode,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
