import React from "react";

export default function EmergencyPage({ params }: { params: { id: string } }) {
    const emergencyId = params.id;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-red-700 mb-4">
                Volunteer Responses
            </h2>
            
        </div>
    );
}