"use client";

// エンドポイントにアクセスして、プロジェクトの一覧を取得する
import React, { useEffect, useState } from "react";
import { auth } from "@clerk/nextjs";

export const Projects: React.FC<{ userId: string }> = ({ userId }) => {
  const [projects, setProjects] = React.useState<any[]>([]);
  console.log(userId);
  React.useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(`http://localhost:3001/${userId}/projects`);
      const data = await response.json();
      console.log("hoge");
      console.log(data);
      setProjects(data);
    };
    fetchProjects();
  }, [userId]);

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.project_id}>{project.project_title}</li>
        ))}
      </ul>
    </div>
  );
};
