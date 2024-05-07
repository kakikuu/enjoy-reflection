"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CreateConferenceRecord: React.FC<{
  user_clerk_id: string;
  project_id: string;
  personal_reflection_id: string;
}> = ({ user_clerk_id, project_id, personal_reflection_id }) => {
  const router = useRouter();
  const [conferenceTitle, setConferenceTitle] = useState(""); // 記者会見のタイトル状態

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // APIエンドポイントにリクエストを送信
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user_clerk_id}/projects/${project_id}/conference-records/${personal_reflection_id}/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conference_title: conferenceTitle,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Conference record creation failed");
      }

      const result = await response.json();
      console.log("Conference record created:", result);
      // 成功メッセージやその他の操作

      // inputの値をリセット
      setConferenceTitle("");
      // 成功した後のリダイレクトなどの処理
      router.push(
        `/project/${project_id}/personalReflection/${personal_reflection_id}/conferenceRecord/${result.conference_record_id}`
      );
    } catch (error) {
      console.error("Failed to create conference record:", error);
    }
  };

  return (
    <div>
      <h1>Create Conference Record</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={conferenceTitle}
          onChange={(e) => setConferenceTitle(e.target.value)}
          placeholder="Conference title"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateConferenceRecord;
