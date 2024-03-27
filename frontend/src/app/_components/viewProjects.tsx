"use client";

import React from "react";
import { useRouter } from "next/navigation";

export const ViewProjects: React.FC<{ user_clerk_id: string }> = ({
  user_clerk_id,
}) => {
  const router = useRouter();
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(
        `http://localhost:3001/users/${user_clerk_id}/projects`
      );
      const data = await response.json();
      setProjects(data);
      console.log(data);
    };
    fetchProjects();
  }, [user_clerk_id]);

  // プロジェクトの詳細ページに遷移する関数
  const moveProjectDetail = (project_id) => {
    router.push(`/project/${project_id}`);
  };

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.project_id}>
            {/* プロジェクトのタイトルをクリックしたら、そのプロジェクトの詳細ページに遷移する */}
            <button onClick={() => moveProjectDetail(project.project_id)}>
              {project.project_title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
