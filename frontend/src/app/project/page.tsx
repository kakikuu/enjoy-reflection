"use client";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { ViewProjects } from "../_components/viewProjects";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div>
      <UserButton />
      <div className="my-16 flex flex-col items-center">
        {user && (
          <>
            <button onClick={() => router.push(`/project/createProject`)}>
              プロジェクトを作成する
            </button>
            <ViewProjects user_clerk_id={user.id} />
          </>
        )}
        <p className="text-lg">You are signed in</p>
      </div>
    </div>
  );
}
