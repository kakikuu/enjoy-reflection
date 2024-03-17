const { supabaseClient } = require("../config/supabase.ts");
const express = require("express");
const router = express.Router();

// すべてのTodoを取得するための非同期関数
const getAllTodos = async () => {
  // todoテーブルからすべてのカラムを取得し、todosに代入します。
  const peojects = await supabaseClient.from("projects").select("*");
  // todosのデータをログに出力します。
  console.log(peojects.data);
  // peojects.dataを返します。
  return peojects.data;
};

const getProject = async (userId) => {
  // todoテーブルからすべてのカラムを取得し、todosに代入します。
  const peojects = await supabaseClient
    .from("projects")
    .select("*")
    .eq("user_id", userId);
  // todosのデータをログに出力します。
  console.log(peojects.data);
  // peojects.dataを返します。
  return peojects.data;
};

router.get("/", async (req, res) => {
  console.log("getAllTodosが呼ばれました");
  // getAllTodos関数を呼び出し、データを取得します。
  const projects = await getAllTodos();
  // 取得したデータをレスポンスとして返します。
  res.json(projects);
  console.log(projects);
});

router.get("/:user_id/projects", function (req, res, next) {
  // ユーザーIDを取得
  const userId = req.params.user_id;

  // ユーザーIDに基づいてプロジェクトを取得するなどの処理を実行
  const projects = getProject(userId);
  // 例えば、userId を使用してデータベースからプロジェクトを取得する
  // この部分はプロジェクトの実際の処理に合わせて適切に記述する

  res.send(`User ${userId}'s projects`); // ダミーレスポンス
});

module.exports = getAllTodos;
