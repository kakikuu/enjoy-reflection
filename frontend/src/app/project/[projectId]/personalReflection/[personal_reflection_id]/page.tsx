"use client";
import ReflectionDetails from "../../../../_components/viewPersonalRefelectionDetail";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const PersonalReflectionPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId;
  const personal_reflection_id = params.personal_reflection_id;

  console.log(personal_reflection_id);
  return (
    <div>
      {user && (
        <div>
          <button
            onClick={() =>
              router.push(
                `/project/${projectId}/personalReflection/${personal_reflection_id}/conferenceRecord`
              )
            }
          >
            記者会見を開く
          </button>
          <ReflectionDetails
            user_clerk_id={user.id}
            project_id={projectId}
            personal_reflection_id={personal_reflection_id}
          />
        </div>
      )}
    </div>
  );
};

export default PersonalReflectionPage;
