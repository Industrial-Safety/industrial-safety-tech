import { auth } from "@/auth";
import AuthSuccessClient from "./client-page";

export default async function AuthSuccessPage() {
  const session = await auth();
  const isNewUser = session?.isNewUser === true;
  const newUserEmail = isNewUser ? (session?.newUserEmail ?? session?.user?.email ?? undefined) : undefined;

  return <AuthSuccessClient newUserEmail={newUserEmail} />;
}