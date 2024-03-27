const { supabaseClient } = require("../config/supabase.ts");
const express = require("express");
const router = express.Router({ mergeParams: true });

const getPersonalReflection = async (userId, projectId) => {
  // プロジェクトに属する個人の反省を取得
  const personalReflections = await supabaseClient
    .from("personal_reflections")
    .select("*")
    .eq("user_id", userId)
    .eq("project_id", projectId);

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
  // プロジェクトに属する個人の反省を取得
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

router.get("/personal-reflections-details/:conference_id", async (req, res) => {
  // 記者会見に紐づく個人反省記事を取得
  const { conference_id } = req.params;

  try {
    const conferenceResult = await supabaseClient
      .from("conference_records")
      .select("personal_reflection_id")
      .eq("conference_record_id", conference_id)
      .select();

    if (conferenceResult.error || !conferenceResult.data) {
      throw new Error("Conference record not found");
    }

    // todo: data[0]だとconference内に記事が1つを前提にしているが、今後は複数を可能にするため、番号も指定する
    const personalId = conferenceResult.data[0].personal_reflection_id;

    const personalReflectionsResult = await supabaseClient
      .from("personal_reflections")
      .select("title, content_K, content_P, content_T")
      .eq("personal_reflection_id", personalId);
    if (personalReflectionsResult.error) {
      throw personalReflectionsResult.error;
    }
    console.log(personalReflectionsResult.data);

    res.json({
      message: "Personal reflections details retrieved successfully",
      details: personalReflectionsResult.data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve personal reflections details",
      error: error.message,
    });
  }
});

module.exports = router;
