import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LucidApp from "@/app/components/LucidApp";

export default async function Page() {
  const session = await getSession();
  if (!session.authenticated) {
    redirect("/login");
  }
  return <LucidApp />;
}
