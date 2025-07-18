import { junctureBackend } from "@/lib/juncture/backend";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export default async function Home() {

  const { orgId } = await auth();

  // will never happen
  if (!orgId) {
    return null
  }

  const status = await junctureBackend.general.checkConnectionValidity({
    externalId: orgId,
    provider: 'jira'
  });

  if (!status.exists || status.isInvalid) {
    return redirect("/integrations");
  }

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}