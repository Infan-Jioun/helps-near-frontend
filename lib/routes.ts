import { LucideIcon } from "lucide-react";

export type Route = {
    title: string;
    icon: LucideIcon
    items: {
        title: string;
        url: string;
    }[];
};