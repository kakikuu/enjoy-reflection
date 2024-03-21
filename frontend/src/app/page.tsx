import { auth,UserButton } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ViewProjects } from "./_components/viewProjects";


export default async function Page() {
  let { userId } = auth();
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  if (userId) {
    return (
      <div>
        <UserButton />
        <button>プロジェクト作成</button>
        {user && (
          <div className="my-16 flex flex-col items-center">
            <h1 className="text-2xl font-bold">こんにちは {user.firstName}</h1>
            <p className="text-lg">You are signed in</p>
          </div>
        )}
        <SignOutButton />
        <ViewProjects user_clerk_id={userId} />
      </div>
    );
  }
}