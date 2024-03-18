import { auth, clerkClient } from "@clerk/nextjs";

export const getUser = async () => {
    const { userId } = auth();
    const user = userId ? await clerkClient.users.getUser(userId) : null;
    return user;
};