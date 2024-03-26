import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const ProjectDetail: React.FC<{ projectId: string | string[] }> = ({
  projectId,
}) => {
  const { user } = useUser();
  const [project, setProject] = useState(null);
  console.log("project", projectId);

  useEffect(() => {
    if (!projectId || !user?.id) return;

    // APIエンドポイントからプロジェクトの詳細を取得
    const fetchProject = async () => {
      const response = await fetch(
        `http://localhost:3001/users/${user.id}/projects/${projectId}`
      );
      const data = await response.json();
      setProject(data);
      console.log("projectだぜ", data);
    };

    fetchProject();
  }, [projectId, user?.id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Project Detail</h1>
      <p>Title: {project.project_title}</p>
      {/* ここに他のプロジェクト詳細情報を表示 */}
    </div>
  );
};

export default ProjectDetail;
