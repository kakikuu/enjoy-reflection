const { supabaseClient } = require("../config/supabase.ts");
const express = require("express");
const router = express.Router({ mergeParams: true });

const getPersonalReflection = async (userId, projectId) => {
  const personalReflections = await supabaseClient
    .from("personal_reflections")
    .select("*")
    .eq("user_id", userId)
    .eq("project_id", projectId);

  console.log("personalReflections");
  console.log(personalReflections.data);
  console.log("------");

  const conferenceRecordsData = await supabaseClient
    .from("conference_records")
    .select("*")
    .eq("project_id", projectId);
  console.log("conferenceRecordsData");
  console.log(conferenceRecordsData.data);
  console.log("------");

  return {
    personalReflections: personalReflections.data,
    conferenceRecords: conferenceRecordsData.data,
  };
};

router.get("/", async (req, res) => {
  const userId = req.params.user_id;
  const projectId = req.params.project_id;

  try {
    const data = await getPersonalReflection(userId, projectId);
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server Error");
  }
});

router.post("/", async (req, res) => {
  const { user_id, project_id } = req.params;
  const {
    reflection_title,
    reflection_content_K,
    reflection_content_P,
    reflection_content_T,
  } = req.body;
  console.log("user_id", user_id);
  console.log("project_id", project_id);
  console.log("reflection_title", reflection_title);
  console.log("reflection_content_K", reflection_content_K);
  console.log("reflection_content_P", reflection_content_P);
  console.log("reflection_content_T", reflection_content_T);

  try {
    const { data, error } = await supabaseClient
      .from("personal_reflections")
      .insert([
        {
          user_id: user_id,
          project_id: project_id,
          title: reflection_title,
          content_K: reflection_content_K,
          content_P: reflection_content_P,
          content_T: reflection_content_T,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json({
      message: "Personal reflection added successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add personal reflection",
      error: error.message,
    });
  }
});
module.exports = router;
