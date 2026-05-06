import { cookies } from "next/headers";
import AuthSuccessClient from "./client-page";

export default async function AuthSuccessPage() {
  const cookieStore = await cookies();
  const newUserEmail = cookieStore.get("is_new_oauth_user")?.value;

  // Renderizamos el cliente y le pasamos el email (si existe) para que maneje la redirección en la ventana principal
  return <AuthSuccessClient newUserEmail={newUserEmail} />;
}
