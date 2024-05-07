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
      <div>
        <button onClick={() => router.push(`/project`)}>
          プロジェクト選択画面に戻る
        </button>

        <button onClick={() => router.push(`/project/createProject`)}>
          プロジェクトを作成する
        </button>
      </div>
      <div>　　　　　　　</div>
      {user && (
        <div>
          <button
            onClick={() =>
              router.push(`/project/${projectId}/personalReflection`)
            }
          >
            個人反省を行う
          </button>
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
