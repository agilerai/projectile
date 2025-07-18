export const dynamic = 'force-dynamic'

import { junctureBackend } from "@/lib/juncture/backend";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import MeetingUploadForm from "@/components/custom/meeting-upload-form";




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
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Upload Meeting Recording</h1>

      <MeetingUploadForm />
    </div>
  );
}