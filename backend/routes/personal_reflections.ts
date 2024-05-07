const { supabaseClient } = require("../config/supabase.ts");
const express = require("express");
const router = express.Router({ mergeParams: true });

const getPersonalReflection = async (user_clerk_id, projectId) => {

  // プロジェクトに関するデータ(個人反省・記者会見)を取得

  console.log("userId", user_clerk_id);
  console.log("projectId", projectId);

  const { data: userData, error: userError } = await supabaseClient
    .from("users")
    .select("user_id")
    .eq("user_clerk_id", user_clerk_id)
    .select();
  console.log("userData", userData);

  if (userError) throw new Error(userError.message);
  if (!userData) throw new Error("User not found");
  const user_id = userData[0].user_id;
  console.log("user_id", user_id);

  const personalReflections = await supabaseClient
    .from("personal_reflections")
    .select("*")
    .eq("user_id", user_id)

    .eq("project_id", projectId)
    .select();

  const conferenceRecordsData = await supabaseClient
    .from("conference_records")
    .select("*")
    .eq("project_id", projectId)
    .select();

  console.log(personalReflections.data);
  console.log("------");
  console.log("conferenceRecordsData");
  console.log(conferenceRecordsData.data);
  console.log("------");

  return {
    personalReflections: personalReflections.data,
    conferenceRecords: conferenceRecordsData.data,
  };
};

router.get("/", async (req, res) => {
  const userClerkId = req.params.user_clerk_id;
  const projectId = req.params.project_id;

  try {
    const data = await getPersonalReflection(userClerkId, projectId);
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server Error");
  }
});

router.post("/", async (req, res) => {
  const { user_clerk_id, project_id } = req.params;
  const {
    reflection_title,
    reflection_content_K,
    reflection_content_P,
    reflection_content_T,
  } = req.body;
  console.log("user_id", user_clerk_id);

  try {
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("user_id")
      .eq("user_clerk_id", user_clerk_id)
      .select(); // Assumes each clerk_id is associated with exactly one user

    if (userError) throw userError;
    if (!userData) throw new Error("User not found");

    const user_id = userData[0].user_id;
    console.log("user_idだよ", user_id);

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

router.get(
  "/personal-reflections-details/:personal_reflection_id",
  async (req, res) => {
    console.log("ほげ");
    // 記者会見に紐づく個人反省記事を取得
    const { personal_reflection_id } = req.params;

    try {
      const personalReflectionData = await supabaseClient
        .from("personal_reflections")
        .select("*")
        .eq("personal_reflection_id", personal_reflection_id)
        .select();

      if (personalReflectionData.error || !personalReflectionData.data) {
        throw new Error("Conference record not found");
      }
      console.log(personalReflectionData.data);
      const personalId = personalReflectionData.data[0].personal_reflection_id;

      res.json({
        message: "Personal reflections details retrieved successfully",
        details: personalReflectionData.data,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve personal reflections details",
        error: error.message,
      });
    }
  }
);

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

router.get(
  "/personal-reflections-details/:personal_reflection_id/conference-records",
  async (req, res) => {
    // 記者会見に紐づく個人反省記事を取得
    const { personal_reflection_id } = req.params;

    try {
      const personalReflectionData = await supabaseClient
        .from("conference_records")
        .select("*")
        .eq("conference_record_id", personal_reflection_id)
        .select();

      if (personalReflectionData.error || !personalReflectionData.data) {
        throw new Error("Conference record not found");
      }

      const personalId = personalReflectionData.data[0].personal_reflection_id;

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
  }
);

module.exports = router;
