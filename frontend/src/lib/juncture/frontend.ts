import { JunctureFrontend } from "juncture-sdk";

export const junctureFrontend = new JunctureFrontend({
    config: {
        junctureApiUrl: process.env.NEXT_PUBLIC_JUNCTURE_API_URL!
    },
});
