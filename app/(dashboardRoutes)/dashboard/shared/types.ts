
export type EmergencyStatus =
    | "PENDING"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CANCELLED";

export interface VolunteerProfile {
    skills?: string[];
    averageRating?: number;
    isVerified?: boolean;
    fee?: number;
    isFree?: boolean;
    bio?: string;
}

export interface VolunteerInfo {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    volunteerProfile?: VolunteerProfile | null;
}

export interface VolunteerResponse {
    id: string;
    message?: string | null;
    estimatedArrivalMin?: number | null;
    acceptedAt?: string | null;
    createdAt?: string | null;
    volunteer: VolunteerInfo;
}

export interface Emergency {
    id: string;
    status: EmergencyStatus;
    description: string;
    address: string;
    district: string;
    isPriority: boolean;
    createdAt: string;
    type?: string;
    user?: { id: string; name: string; email: string; phone: string };
    responses?: VolunteerResponse[];
    volunteerResponses?: VolunteerResponse[];
}