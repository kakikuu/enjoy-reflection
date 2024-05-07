"use client";
import ReflectionForm from "@/app/_components/createPersonalReflection";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// メインコンポーネントのPropsの型定義
interface ReflectionDetailsProps {
  user_clerk_id: string;
  project_id: string;
  personal_reflection_id: string;
}

const ReflectionDetails: React.FC<ReflectionDetailsProps> = ({
  user_clerk_id,
  project_id,
  personal_reflection_id,
}) => {
  const [personalReflection, setPersonalReflection] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 個人反省の詳細を取得する
  useEffect(() => {
    const fetchPersonalReflectionDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${user_clerk_id}/projects/${project_id}/personal-reflections/personal-reflections-details/${personal_reflection_id}`
        );
        if (!response.ok) throw new Error("反省の詳細の取得に失敗しました");

        const data = await response.json();
        if (data.details.length > 0) {
          setPersonalReflection(data.details[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("個人反省の詳細の取得エラー:", error);
        setLoading(false);
      }
    };

    fetchPersonalReflectionDetails();
  }, [personal_reflection_id]);

  if (loading) return <div>読み込み中...</div>;

  return (
    <div>
      {personalReflection ? (
        <div>
          {/* <button
            onClick={() =>
              router.push(
                `/project/${project_id}/personalReflection/${personal_reflection_id}/conferenceRecord`
              )
            }
          >
            記者会見を開く
          </button> */}
          <div>
            <h1>{personalReflection.title}</h1>
            <p>Keep: {personalReflection.content_K}</p>
            <p>Problems: {personalReflection.content_P}</p>
            <p>Try: {personalReflection.content_T}</p>
          </div>
        </div>
      ) : (
        <ReflectionForm user_clerk_id={user_clerk_id} project_id={project_id} />
      )}
    </div>
  );
};

export default ReflectionDetails;
