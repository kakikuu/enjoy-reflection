const { supabaseClient } = require("../config/supabase.ts");
const express = require("express");
const router = express.Router({ mergeParams: true });

// すべてのTodoを取得するための非同期関数
// const getAllTodos = async () => {
//   // todoテーブルからすべてのカラムを取得し、todosに代入します。
//   // const peojects = await supabaseClient.from("projects").select("*");
//   let userId = 1;
//   const peojects = await supabaseClient
//     .from("projects")
//     .select("*")
//     .eq("user_id", userId);
//   // todosのデータをログに出力します。
//   console.log(peojects.data);
//   // peojects.dataを返します。
//   return peojects.data;
// };

const getProject = async (userId) => {
  const peojects = await supabaseClient
    .from("projects")
    .select("*")
    .eq("user_id", userId);

  console.log("getProject");
  console.log(peojects.data);
  console.log("------");
  // peojects.dataを返します。
  return peojects.data;
};
router.get("/", async function (req, res, next) {
  // ユーザーIDを取得
  const userId = req.params.user_id;
  // userIdを数字に変換
  console.log(userId);

  console.log("getAllTodosが呼ばれました");
  const projects = await getProject(userId);
  console.log(projects);
  // プロジェクトのデータをレスポンスとして返す
  res.json(projects);
});

module.exports = router;
