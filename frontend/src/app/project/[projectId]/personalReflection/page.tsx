"use client";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import ReflectionForm from "../../../_components/createPersonalReflection";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();

  const projectId = params.projectId;
  console.log(projectId);

  return (
    <div>
      <UserButton />
      <div className="my-16 flex flex-col items-center">
        {user && (
          <>
            <button onClick={() => router.push(`/project/createProject`)}>
              プロジェクトを作成する
            </button>
            <ReflectionForm user_clerk_id={user.id} project_id={projectId} />
          </>
        )}
        <p className="text-lg">You are signed in</p>
      </div>
    </div>
  );
}
