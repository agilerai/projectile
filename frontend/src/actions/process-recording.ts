"use server"

import { supabase } from "@/lib/supabase/server";
import {celeryClient} from "@/lib/celery";

export async function processRecording(path: string) {
    const task = celeryClient.createTask("main.process_recording");
    const result = task.applyAsync([path]);
    const data = await result.get();
    console.log(data);
    return data;
}