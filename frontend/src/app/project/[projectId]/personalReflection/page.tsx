"use client";
import ReflectionForm from "@/app/_components/createPersonalReflection";
import { useParams } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";

export default function Page() {
  const params = useParams();
  const projectId = params.projectId;
  // const router = useRouter();
  const { isSignedIn, user } = useUser();
  console.log(user);
  return (
    <div>
      {user && (
        <ReflectionForm user_clerk_id={user.id} project_id={projectId} />
      )}
    </div>
  );
}
