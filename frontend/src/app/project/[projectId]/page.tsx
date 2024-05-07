"use client";
import React from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import ProjectDetail from "@/app/_components/projectDetail";
import { useRouter } from "next/navigation";
import ConferencePage from "../../_components/viewConference";
import ViewPersonalReflections from "../../_components/viewPersonalRefelections";

function ProjectPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();

  const projectId = params.projectId;
  console.log(projectId);

  return (
    <div>
      <UserButton />
      <ProjectDetail projectId={projectId} />

      <button
        onClick={() => router.push(`/project/${projectId}/conferenceRecord`)}
      >
        プロジェクトを作成する
      </button>
      {user && (
        <div>
          <ViewPersonalReflections
            userClerkId={user.id}
            projectId={projectId}
          />
          <ConferencePage user_clerk_id={user.id} project_id={projectId} />
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
