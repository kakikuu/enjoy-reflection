"use client";

import PersonalReferencePage from "../../../../_components/viewPersonalRefelection";
import { useParams } from "next/navigation";
import { useUser, useSignIn } from "@clerk/nextjs";

export default function ConferenceRecordPage() {
  const params = useParams();
  console.log(params);
  const { user } = useUser();
  console.log(user);
  const signIn = useSignIn();
  console.log(signIn);

  const projectId = params.projectId;
  const conferenceRecordId = params.conferenceRecordId;
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
      {!user && <p>Please sign in to view this page.</p>}
    </div>
  );
}
