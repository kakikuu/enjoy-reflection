// src/app/project/[projectId]/page.tsx
"use client";
import React from "react";
import { useParams } from "next/navigation";
import ProjectDetail from "@/app/_components/projectDetail";

function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId;
  console.log(projectId);

  return (
    <div>
      <h1>Project Page</h1>
      <ProjectDetail projectId={projectId} />
    </div>
  );
}

export default ProjectPage;
