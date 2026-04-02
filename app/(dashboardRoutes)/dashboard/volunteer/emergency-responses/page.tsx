import React from "react";
import Response from "../../shared/Response";

export default function EmergencyPage({ params }: { params: { id: string } }) {
    const emergencyId = params.id;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-red-700 mb-4">
                Volunteer Responses
            </h2>
            <Response emergencyId={emergencyId} />
        </div>
    );
}