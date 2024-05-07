"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ViewPersonalReflections = ({ userClerkId, projectId }) => {
  const router = useRouter();
  const [personalReflections, setPersonalReflections] = useState([]);

  useEffect(() => {
    const fetchPersonalReflections = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userClerkId}/projects/${projectId}/personal-reflections`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch personal reflections");
        }
        const data = await response.json();
        console.log("Personal reflections data:", data);
        // APIからのレスポンスがnullまたはundefinedの場合、または配列でない場合は空の配列を設定
        setPersonalReflections(
          Array.isArray(data.personalReflections)
            ? data.personalReflections
            : []
        );
      } catch (error) {
        console.error("Error fetching personal reflections:", error);
        setPersonalReflections([]);
      }
    };

    fetchPersonalReflections();
  }, [userClerkId, projectId]);
  return (
    <div>
      {personalReflections.map((reflection) => (
        <button
          key={reflection.personal_reflection_id}
          onClick={() =>
            router.push(
              `/project/${projectId}/personalReflection/${reflection.personal_reflection_id}`
            )
          }
        >
          {reflection.title}
        </button>
      ))}
    </div>
  );
};

export default ViewPersonalReflections;
