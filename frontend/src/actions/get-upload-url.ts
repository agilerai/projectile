"use server"

import { supabase } from "@/lib/supabase/server";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";


type UploadUrlResponse = {
    url: string;
    token: string;
    id: string;
} | {
    error: string;
}

// still use server action as a post just bc its easier. I should really look into TRPC in the future.
export async function getUploadUrl(fileType: string): Promise<UploadUrlResponse> {
    const { userId } = await auth();
    if (!userId) {
        return { error: "Unauthorized" };
    }
    
    // generate unique id for the file
    const id = crypto.randomUUID();
    const { data, error } = await supabase.storage.from('meetings').createSignedUploadUrl(
        `${id}.${fileType}`
    )

    if (error) {
        console.error(error);
        return { error: error.message };
    }

    return { url: data.signedUrl, token: data.token, id: id };
}