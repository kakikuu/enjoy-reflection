"use client";

// エンドポイントにアクセスして、プロジェクトの一覧を取得する
import React from "react";

export const ViewProjects: React.FC<{ user_clerk_id: string }> = ({
  user_clerk_id,
}) => {
  const [projects, setProjects] = React.useState<any[]>([]);
  console.log(user_clerk_id);
  React.useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(
        `http://localhost:3001/users/${user_clerk_id}/projects`
      );
      const data = await response.json();
      setProjects(data);
    };
    fetchProjects();
  }, [user_clerk_id]);

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
