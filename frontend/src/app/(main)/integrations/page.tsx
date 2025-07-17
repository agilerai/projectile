export const dynamic = 'force-dynamic';

import IntegrationCard from "@/components/custom/integration-card";
import { junctureBackend } from "@/lib/juncture/backend";
import { auth } from "@clerk/nextjs/server";

export default async function IntegrationsPage() {
    const { orgId } = await auth();

    if (!orgId) {
        return null;
        // should never happen
    }

    const status = await junctureBackend.general.checkConnectionValidity({
        externalId: orgId,
        provider: 'jira'
    });


    return (
        <div className="p-8 flex flex-col gap-4">
            <h1>Integrations</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <IntegrationCard 
                    name="Jira" 
                    description="Jira is required for Projectile to function" 
                    image="/jira.svg" 
                    exists={status.exists}
                    isInvalid={status.isInvalid}
                    orgId={orgId}
                />
            </div>
        </div>
    )
}