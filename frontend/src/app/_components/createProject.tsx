"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CreateProject: React.FC<{ user_clerk_id: string }> = ({
  user_clerk_id,
}) => {
  const router = useRouter();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectID, setProjectID] = useState(""); // プロジェクトIDの状態
  const [inviteCode, setInviteCode] = useState(""); // 招待コードの状態

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // APIエンドポイントにリクエストを送信
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user_clerk_id}/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_title: projectTitle,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Project creation failed");
      }

      const result = await response.json();
      console.log("Project created:", result);
      setProjectID(result.project_id); // プロジェクトIDを状態にセット
      setInviteCode(result.invite_code); // 招待コードを状態にセット
      // inputの値をリセット
      setProjectTitle("");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <div>
      <h1>Create Project</h1>
      {!projectID && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Project title"
          />
          <button type="submit">Create</button>
        </form>
      )}
      {projectID && (
        <div>
          <p>プロジェクトを作成しました</p>
          <p>Project ID: {projectID}</p>
          <p>招待コード: {inviteCode}</p>
          <button onClick={() => router.push(`/project/${projectID}`)}>
            Go to project
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateProject;
