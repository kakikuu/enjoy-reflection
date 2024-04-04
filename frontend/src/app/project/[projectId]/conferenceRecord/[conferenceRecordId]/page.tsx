"use client";

import PersonalReferencePage from "../../../../_components/viewPersonalRefelection";
import { useParams } from "next/navigation";
import { useUser, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ConferenceRecordPage() {
  const params = useParams();
  const { user } = useUser();
  const signIn = useSignIn();
  const router = useRouter();

  const projectId = params.projectId;
  const conferenceRecordId = params.conferenceRecordId;

  function QuestionPage() {
    router.push(
      `/project/${projectId}/conferenceRecord/${conferenceRecordId}/question`
    );
  }
  return (
    <div>
      <h1>Conference Record Page</h1>
      {user && (
        <PersonalReferencePage
          user_clerk_id={user.id}
          project_id={projectId}
          conferenceRecordId={conferenceRecordId}
        />
      )}
      <button onClick={QuestionPage}>質疑応答に進む</button>
      {!user && <p>Please sign in to view this page.</p>}
    </div>
  );
}
