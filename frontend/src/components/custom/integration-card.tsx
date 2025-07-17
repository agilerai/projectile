"use client";

import Image from "next/image";
import { junctureFrontend } from "@/lib/juncture/frontend";
import { CheckCircleIcon, InfoIcon } from "lucide-react";

type IntegrationCardProps = {
    name: string;
    description: string;
    image: string;
    exists: boolean;
    isInvalid: boolean;
    orgId: string;
}

export default function IntegrationCard({ name, description, image, exists, isInvalid, orgId }: IntegrationCardProps) {

    async function handleClick() {
        if (!exists || isInvalid) {
            // redirect to the integration page
            await junctureFrontend.completeIntegration("jira", orgId, "nextjs");
        }
    }

    return (
        <div className="flex flex-col gap-2 p-4 border rounded-md cursor-pointer hover:scale-105 transition-all" onClick={handleClick}>
            <Image src={image} alt={name} width={100} height={100} />
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            {exists && !isInvalid && (
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
            )}
            {exists && isInvalid && (
                <InfoIcon className="w-4 h-4 text-yellow-500" />
            )}
        </div>
    )
}