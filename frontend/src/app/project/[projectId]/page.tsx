// src/app/project/[projectId]/page.tsx
"use client";
import React from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import ProjectDetail from "@/app/_components/projectDetail";
import { useRouter } from "next/navigation";
import ConferencePage from "../../_components/viewConference";

function ProjectPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId;
  console.log(projectId);
  function clickMoveConference() {
    console.log("clickMoveConference");
    router.push(`/project/${projectId}/conferenceRecord`);
  }

  return (
    <div>
      <UserButton />
      <h1>Project Page</h1>
      <ProjectDetail projectId={projectId} />
      {user && <ConferencePage user_clerk_id={user.id} projectId={projectId} />}
    </div>
  );
}

export default ProjectPage;
