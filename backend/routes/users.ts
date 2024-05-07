var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/:user_id", async (req, res) => {
  console.log("user");
  const { user_id } = req.params;
  console.log("user_id", user_id);

  try {
    // usersテーブルにuser_clerk_idを格納し、その結果を取得
    const { data: userData, error } = await supabaseClient
      .from("users")
      .insert([{ user_clerk_id: user_id }])
      .select();

    if (error) {
      throw error;
    }

    console.log("Inserted userData", userData);
    res.json({
      message: "User successfully created",
      userData: userData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create a user",
      error: error.message,
    });
  }
});

module.exports = router;
