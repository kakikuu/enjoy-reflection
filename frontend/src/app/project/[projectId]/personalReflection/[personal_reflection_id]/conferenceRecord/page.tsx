"use client";

import React, { useState } from "react";
import CreateConferenceRecord from "../../../../../_components/createConference";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";

export default function Page() {
  const { user } = useUser();
  console.log(user);
  // パラメータからプロジェクトIDを取得
  const params = useParams();
  const projectId = params.projectId;
  const personal_reflection_id = params.personal_reflection_id;
  console.log(personal_reflection_id);

  return (
    <div>
      <h1>Conference Record</h1>
      {user && (
        <CreateConferenceRecord
          user_clerk_id={user.id}
          project_id={projectId}
          personal_reflection_id={personal_reflection_id}
        />
      )}
    </div>
  );
}
