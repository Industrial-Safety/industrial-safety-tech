import { auth } from "@/auth";
import AuthSuccessClient from "./client-page";

export default async function AuthSuccessPage() {
  const session = await auth();
  const sessionError = (session as any)?.error as string | undefined;
  const isNewUser = !sessionError && session?.isNewUser === true;
  const newUserEmail = isNewUser ? (session?.newUserEmail ?? session?.user?.email ?? undefined) : undefined;

  return <AuthSuccessClient newUserEmail={newUserEmail} error={sessionError} />;
}