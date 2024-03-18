import { auth,UserButton } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { Projects } from "./_components/Projects";


export default async function Page() {
  let { userId } = auth();
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  userId = 1;
  if (userId) {
    return (
      <div>
        <UserButton />
        {user && (
          <div className="my-16 flex flex-col items-center">
            <h1 className="text-2xl font-bold">Welcome, {user.firstName}</h1>
            <p className="text-lg">You are signed in</p>
          </div>
        )}
        <SignOutButton />
        <Projects userId={userId} />
      </div>
    );
  }
}