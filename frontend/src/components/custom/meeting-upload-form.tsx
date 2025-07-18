"use client"

import { Button } from "../ui/button";
import { useState } from "react";

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

export default function MeetingUploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = () => {
        if (isUploading) {
            return;
        }
        if (!file) {
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(false);
        
    }

    const fileChosenText = file ? file.name : "No file chosen";
    const videoPreview = file ? URL.createObjectURL(file) : null;

    return (
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
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <span className="text-xs text-gray-400 mt-2">{fileChosenText}</span>
                {videoPreview && (
                    <video src={videoPreview} className="w-[50%] object-cover" />
                )}
            </label>
            <Button className="w-full mt-4" onClick={handleUpload} disabled={isUploading}>Upload</Button>

            <p className="text-sm text-gray-500">
                Supported formats: Video and Audio files
            </p>
        </div>
    )
}