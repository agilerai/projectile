import { Button } from "@/components/ui/button";
import { junctureBackend } from "@/lib/juncture/backend";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";


const supportedFormats = [
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/mkv",
  "video/webm",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/m4a",
  "audio/aac",
  "audio/flac",
  "audio/wma",
];

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

      <div className="w-full h-full p-2 flex flex-col items-center justify-center">
        <label
          htmlFor="file-upload"
          className="w-full min-h-[140px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer transition hover:border-blue-400 bg-gray-50 px-4 py-6"
        >
          <span className="text-lg font-medium text-gray-700 mb-2">Drag &amp; drop a video file here</span>
          <span className="text-sm text-gray-500 mb-4">or click to choose a file</span>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept={supportedFormats.join(",")}
          />
          <span className="text-xs text-gray-400 mt-2">No file chosen</span>
        </label>
        <Button className="w-full mt-4">Upload</Button>

        <p className="text-sm text-gray-500">
          Supported formats: Video and Audio files
        </p>
      </div>
    </div>
  );
}