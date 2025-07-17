import { JunctureBackend } from "juncture-sdk";

export const junctureBackend = new JunctureBackend({
    config: {
        junctureApiUrl: process.env.NEXT_PUBLIC_JUNCTURE_API_URL!,
        junctureSecretKey: process.env.JUNCTURE_SECRET_KEY!
    },
});