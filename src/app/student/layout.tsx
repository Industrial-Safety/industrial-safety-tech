// Server Component — puede usar async/await y auth()
import { auth } from "@/auth";
import StudentLayoutClient from "./layout-client";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <StudentLayoutClient session={session}>
      {children}
    </StudentLayoutClient>
  );
}
