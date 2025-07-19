"use server"

import { supabase } from "@/lib/supabase/server";
import {celeryClient} from "@/lib/celery";
import {auth} from "@clerk/nextjs/server"

export async function processRecording(path: string) {
    const {orgId} = await auth();
    if (!orgId) {
        return null;
    }
    const task = celeryClient.createTask("main.process_recording");
    const result = task.applyAsync([orgId, path]);
    const data = await result.get();
    console.log(data);
    return data;
}