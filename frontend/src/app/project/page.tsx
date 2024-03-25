"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import CreateProject from "../_components/createProject";

export default function Page() {
  const { user } = useUser();
  return (
    <div>
      <UserButton />
      <div className="my-16 flex flex-col items-center">
        {user && <CreateProject user_clerk_id={user.id} />}
        <p className="text-lg">You are signed in</p>
      </div>
    </div>
  );
}
