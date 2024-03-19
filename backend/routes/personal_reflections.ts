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
module.exports = router;
