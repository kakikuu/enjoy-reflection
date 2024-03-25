"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useUser, UserButton } from '@clerk/nextjs';
import { ViewProjects } from "./_components/viewProjects";
import { Button } from "./_components/ui/Button";
import Link from 'next/link';


export default function Page() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  // ユーザーがログインしていない場合はログインページにリダイレクト
  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isSignedIn, router]);



  return (
    <div>
      <UserButton />
      {/* <Button text="プロジェクト作成" onClick={createProject} /> */}
      <Link href="/project">プロジェクトを作成</Link>
      {isSignedIn && (
        <div className="my-16 flex flex-col items-center">
          <h1 className="text-2xl font-bold">こんにちは {user.firstName}</h1>
          <p className="text-lg">You are signed in</p>
          <ViewProjects user_clerk_id={user.id} />
        </div>
      )}
    </div>
  );
}