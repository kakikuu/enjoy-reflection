"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import ConferenceDetailPageProps from "../../../../_components/viewConferenceDetail";

function Page() {
  const router = useRouter();
  const { user } = useUser();
  const params = useParams();
  const conference_id = params.conferenceId;
  const projectId = params.projectId;
  console.log(conference_id);

  return (
    <div>
      <h1>Conference Record</h1>
      {user && (
        <ConferenceDetailPageProps
          userClerkId={user.id}
          projectId={projectId}
          conference_id={conference_id}
        />
      )}
      <button onClick={() => router.push(`/project/${projectId}`)}>
        プロジェクトページに戻る
      </button>
    </div>
  );
}

export default Page;
